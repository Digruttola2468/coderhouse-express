import { Router } from "express";
import CartsManager from "../CarritoManager.js";
import ProductManager from "../ProductManager.js";

import productsModel from "../models/products.model.js";
import cardModel from "../models/cards.model.js";

const ruta = Router();

//const carts = new CartsManager("./src/carrito.json");
//const products = new ProductManager('./src/productos.json')

ruta.get("/carts/:cid", async (req, res) => {
  const cid = req.params.cid;
  try {
    const carrito = await cardModel.findById(cid).populate("products.product");
    res.send(carrito);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "error: no se logro leer" });
  }
});

ruta.post("/carts", async (req, res) => {
  try {
    const result = await cardModel.create({ products: [] });
    res.json({ id: result._id, products: result.products, message: "success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "error: no se logro leer el archivo" });
  }
});

ruta.post("/:cid/product/:pid", async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const quantity = parseInt(req.query?.quantity ?? 1);

  try {
    const cardOne = await cardModel.findOne({ _id: cid });

    //Verificamos si existe el carrito
    if (cardOne) {
      //Verificamos si existe ese producto
      const productOne = await productsModel.findOne({ _id: pid });
      if (productOne) {
        cardOne.products.push({ product: pid, quantity: quantity });

        await cardModel.updateOne({ _id: cid }, cardOne);

        res.send({ message: "success" });
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
    const cardOne = await cardModel.findOne({ _id: cid });

    //Verificamos si existe el carrito
    if (cardOne) {
      //Verificamos si existe ese producto
      const productOne = await productsModel.findOne({ _id: pid });
      if (productOne) {
        //Eliminar el carrito el producto seleccionado

        const filter = cardOne.products.filter((elem) => elem._id != pid);
        await cardModel.updateOne(
          { _id: cid },
          {
            products: filter,
          }
        );

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
    const cardOne = await cardModel.findOne({ _id: cid });

    //Verificamos si existe el carrito
    if (cardOne) {
      cardOne.products = [];

      await cardModel.updateOne({ _id: cid }, cardOne);

      res.send({ message: "success" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Ocurrio un error en el servidor" });
  }
});

export default ruta;
