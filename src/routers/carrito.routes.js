import { Router } from "express";

import { carritoService, productsService } from "../repository/index.js";

const ruta = Router();

ruta.get("/carts/:cid", async (req, res) => {
  const cid = req.params.cid;
  try {
    const carrito = await carritoService.getOneCarrito(cid);
    res.send(carrito);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "error: no se logro leer" });
  }
});

ruta.post("/carts", async (req, res) => {
  try {
    const result = await carritoService.createCarrito({ products: [] });
    res.json({ id: result._id, products: result.products, message: "success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "error: no se logro leer el archivo" });
  }
});

ruta.post("/:cid/product/:pid", async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  let quantity = parseInt(req.query?.quantity ?? 1);

  try {
    const cardOne = await carritoService.getOneCarrito(id);

    //Verificamos si existe el carrito
    if (cardOne) {
      //Verificamos si existe ese producto
      const productOne = await productsService.getOne(pid);
      if (productOne) {
        const findSameProductSameCarrito = cardOne.products.find(
          (elem) => elem.product == productOne._id.toString()
        );

        // Si existe el mismo producto en el mismo carrito
        if (findSameProductSameCarrito) {
          quantity += findSameProductSameCarrito.quantity;

          const listCarritoProducts = cardOne.products.map((elem) => {
            if (elem.product == productOne._id.toString())
              return { ...elem, quantity };
            else return elem;
          });

          cardOne.products = listCarritoProducts;

          await carritoService.updateCarrito(cid, cardOne);

          return res.send({ message: "success" });
        }

        cardOne.products.push({ product: pid, quantity: quantity });

        await carritoService.updateCarrito(cid, cardOne);

        return res.send({ message: "success" });
      } else return res.status(404).json({ message: "Not Found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Ocurrio un error en el servidor" });
  }
});

ruta.put("/carts/:cid", async (req, res) => {});

ruta.put("/carts/:cid/products/:pid", async (req, res) => {});

ruta.delete("/carts/:cid/products/:pid", async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;

  try {
    const cardOne = await carritoService.getOneCarrito(cid);

    //Verificamos si existe el carrito
    if (cardOne) {
      //Verificamos si existe ese producto
      const productOne = await productsService.getOne(pid);
      if (productOne) {
        //Eliminar el carrito el producto seleccionado

        const filter = cardOne.products.filter((elem) => elem._id != pid);
        /*await cardModel.updateOne(
          { _id: cid },
          {
            products: filter,
          }
        );*/
        await carritoService.updateCarrito(cid, { products: filter });

        res.send({ message: "success" });
      } else return res.status(404).json({ message: "Not Found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Ocurrio un error en el servidor" });
  }
});

ruta.delete("/carts/:cid", async (req, res) => {
  const cid = req.params.cid;

  try {
    const cardOne = await carritoService.getOneCarrito(cid);

    //Verificamos si existe el carrito
    if (cardOne) {
      cardOne.products = [];

      await carritoService.updateCarrito(cid, cardOne);

      res.send({ message: "success" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Ocurrio un error en el servidor" });
  }
});

export default ruta;
