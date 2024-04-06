import { Router } from "express";
import {
  carritoService,
  productsService,
  ticketService,
} from "../services/index.repository.js";

const ruta = Router();

ruta.post("/webhook", async (req, res) => {
  // Obtenemos los datos del query enviado por mercado Pago
  const payment = req.query;

  //GET session user
  const user = req.session.user;

  // Validamos si es de tipo payment ya que efectivame lo compro sin problemas
  if (payment.type === "payment") {
    //await mercadopage.payment.findById(payment["data.id"]);
    try {
      const carrito = await carritoService.getOneCarrito(user.cart);

      if (carrito) {
        //Obtenemos los productos del carrito
        const products = carrito.products;

        //Si la lista de productos no esta vacio
        if (products.length != 0) {
          // Filtramos los productos donde la cantidad pedida no supere al stock del producto
          const filterCardsToBuy = products.filter(
            (elem) => elem.product.stock >= elem.quantity
          );

          // Si la lista filtrada anteriormente no esta vacio
          if (filterCardsToBuy.length != 0) {
            
            //Total: esta variable es para colocar el total de todo lo que tiene q pagar
            let total = 0;
            for (let i = 0; i < filterCardsToBuy.length; i++) {
              const element = filterCardsToBuy[i];

              // Restamos el stockActual del producto con la cantidad pedida del usuario
              const stockActualProduct =
                element.product.stock - element.quantity;

              // Actualizamos los productos de cada uno de lo filtrados
              try {
                await productsService.updateProducts(
                  element.product._id,
                  {
                    stock: stockActualProduct,
                  },
                  user
                );

                // Actualizamos la variable total
                total += element.quantity * element.product.price;
              } catch (error) {
                req.logger.fatal("No se actualizo el stock del producto");
                return res.status(500).json({
                  status: 'error',
                  message: "No se actualizo el stock del producto",
                });
              }
            }

            //Luego generar el ticket
            try {
              await ticketService.generateTicket(user, {
                amount: total,
                purchaser: user.email,
              });
            } catch (error) {
              req.logger.fatal("No se genero el ticket del usuario");
              return res.status(500).json({
                status: 'error',
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
            await carritoService.updateCarrito(user.cart, { products: map });
          } catch (error) {
            req.logger.fatal("No se modifico el carrito del usuario");
            return res.status(500).json({
              status: 'error',
              message: "Ocurrio un error al modificar el carrito del usuario",
            });
          }

          return res.sendStatus(204);
        } else {
          req.logger.error("Carrito esta vacio");
          return res
            .status(400)
            .json({ status: "error", message: "Carrito Vacio" });
        }
      } else {
        req.logger.error("No existe ese carrito");
        return res
          .status(404)
          .json({ status: "error", message: "Cart Not Found" });
      }
    } catch (error) {
      return res
        .status(404)
        .json({ status: "error", message: "No existe el carrito" });
    }
  }
});

export default ruta;
