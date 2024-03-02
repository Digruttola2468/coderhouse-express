import { Router } from "express";

import {
  carritoService,
  productsService,
  ticketService,
} from "../services/index.js";
import { authUser } from "./session.routes.js";

const ruta = Router();

ruta.get("/:cid", async (req, res) => {
  const cid = req.params.cid;
  try {
    const carrito = await carritoService.getOneCarrito(cid);
    res.send(carrito);
  } catch (error) {
    req.logger.error("No existe ese carrito");
    res.status(404).json({ message: "error: No existe ese carrito" });
  }
});

ruta.post("/", async (req, res) => {
  try {
    const result = await carritoService.createCarrito({ products: [] });
    res.json({ id: result._id, products: result.products, message: "success" });
  } catch (error) {
    req.logger.fatal("No se creo el carrito");
    res.status(500).json({ message: "Something Wrong" });
  }
});

ruta.post("/:cid/product/:pid", authUser, async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  let quantity = parseInt(req.query.quantity);
  const user = req.session?.user;

  if (!Number.isInteger(quantity)) quantity = 1;

  try {
    const cardOne = await carritoService.getOneCarrito(cid);

    try {
      const productOne = await productsService.getOne(pid);

      if (user.role.toLowerCase() == "premium") {
        if (productOne.owner == user.email)
          return res.status(401).json({
            status: "error",
            message:
              "No estas Habilitado a agregar al carrito un producto propio",
          });
      }

      const findSameProductSameCarrito = cardOne.products.find(
        (elem) => elem.product._id == productOne._id.toString()
      );

      // Si existe el mismo producto en el mismo carrito
      if (findSameProductSameCarrito) {
        quantity += findSameProductSameCarrito.quantity;

        if (quantity > productOne.stock) {
          req.logger.error("Cantidad enviada supera al stock del producto");
          return res.status(400).json({
            message: "La cantidad supera al stock actual del producto",
          });
        }

        const listCarritoProducts = cardOne.products.map((elem) => {
          if (elem.product._id == productOne._id.toString())
            return { ...elem, quantity };
          else return elem;
        });

        cardOne.products = listCarritoProducts;

        try {
          await carritoService.updateCarrito(cid, cardOne);
        } catch (error) {
          req.logger.fatal("No se actualizo el carrito");
          return res
            .status(400)
            .json({ message: "No se actualizo el carrito" });
        }

        return res.send({ message: "success" });
      }

      if (quantity > productOne.stock) {
        req.logger.error("Cantidad enviada supera al stock del producto");
        return res.status(400).json({
          message: "La cantidad supera al stock actual del producto",
        });
      }

      cardOne.products.push({ product: pid, quantity: quantity });

      try {
        await carritoService.updateCarrito(cid, cardOne);
      } catch (error) {
        req.logger.fatal("No se actualizo el carrito");
        return res.status(400).json({ message: "No se actualizo el carrito" });
      }

      return res.send({ message: "success" });
    } catch (error) {
      req.logger.error("No existe ese producto");
      return res.status(404).json({ message: "Not Found product" });
    }
  } catch (error) {
    req.logger.error("No existe ese carrito");
    return res.status(404).json({ message: "No existe ese carrito" });
  }
});

ruta.put("/:cid", async (req, res) => {});

ruta.put("/:cid/product/:pid", async (req, res) => {});

ruta.delete("/:cid/product/:pid", authUser, async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;

  try {
    const cardOne = await carritoService.getOneCarrito(cid);

    try {
      const productOne = await productsService.getOne(pid);
      if (productOne) {
        //Eliminar el carrito el producto seleccionado
        const filter = cardOne.products.filter((elem) => elem.product._id != pid);

        try {
          await carritoService.updateCarrito(cid, { products: filter });
        } catch (error) {
          req.logger.fatal("No se actualizo el carrito");
          return res
            .status(500)
            .json({ message: "No se actualizo el carrito" });
        }

        return res.send({ message: "success" });
      } else return res.status(404).json({ message: "Not Found" });
    } catch (error) {
      req.logger.error("No existe ese producto");
      return res.status(404).json({ message: "No existe ese producto" });
    }
  } catch (error) {
    req.logger.error("No existe ese carrito");
    return res.status(404).json({ message: "No existe ese carrito" });
  }
});

ruta.delete("/:cid", async (req, res) => {
  const cid = req.params.cid;

  try {
    const cardOne = await carritoService.getOneCarrito(cid);

    cardOne.products = [];

    try {
      await carritoService.updateCarrito(cid, cardOne);
    } catch (error) {
      req.logger.fatal("No se actualizo el carrito");
      return res.status(500).json({ message: "No se actualizo el carrito" });
    }

    return res.send({ message: "success" });
  } catch (error) {
    req.logger.error("No existe ese carrito");
    return res.status(404).json({ message: "No existe ese carrito" });
  }
});

ruta.post("/:cid/purchase", authUser, async (req, res) => {
  const idCarrito = req.params.cid;
  const user = req.session.user;
  try {
    const carrito = await carritoService.getOneCarrito(idCarrito);
    if (carrito) {
      const products = carrito.products;

      if (products.length != 0) {
        const filterCardsToBuy = products.filter(
          (elem) => elem.product.stock >= elem.quantity
        );
        if (filterCardsToBuy.length != 0) {
          //En Base al array restar al stock del producto
          let total = 0;
          for (let i = 0; i < filterCardsToBuy.length; i++) {
            const element = filterCardsToBuy[i];

            const stockActualProduct = element.product.stock - element.quantity;

            try {
              await productsService.updateProducts(element.product._id, {
                stock: stockActualProduct,
              });

              total += element.quantity * element.product.price;
            } catch (error) {
              req.logger.fatal("No se actualizo el stock del producto");
              return res.status(500).json({
                message: "No se actualizo el stock del producto",
              });
            }
          }

          //Luego generar el ticket
          try {
            await ticketService.generateTicket({
              amount: total,
              purchaser: user.email,
            });
          } catch (error) {
            req.logger.fatal("No se genero el ticket del usuario");
            return res.status(500).json({
              message: "No se genero el ticket",
            });
          }
        }
        //Filtramos los productos que no tienen stock suficiente a la cantidad solicitada
        const filterCardsToUser = products.filter(
          (elem) => elem.product.stock < elem.quantity
        );

        const map = filterCardsToUser.map((elem) => {
          return {
            product: elem.product._id,
            quantity: elem.quantity,
            _id: elem._id,
          };
        });

        //Modificamos el carrito del usuario de los productos que no tiene stock suficiente
        try {
          await carritoService.updateCarrito(idCarrito, { products: map });
        } catch (error) {
          req.logger.fatal("No se modifico el carrito del usuario");
          return res.status(500).json({
            message: "Ocurrio un error al modificar el carrito del usuario",
          });
        }

        return res.json({ message: "Operacion Exitosa" });
      } else {
        req.logger.error("Carrito esta vacio");
        return res.status(400).json({ message: "Carrito Vacio" });
      }
    } else {
      req.logger.error("No existe ese carrito");
      return res.status(404).json({ message: "Cart Not Found" });
    }
  } catch (error) {
    req.logger.error("No existe ese carrito");
    return res.status(404).json({ message: "No existe ese carrito" });
  }
});

export default ruta;
