import { Router } from "express";
import ProductManager from "../ProductManager.js";
import { Server } from "socket.io";
import { httpServer } from "../app.js";

const ruta = Router();

ruta.get("/", async (req, res) => {
  const product = new ProductManager("./src/productos.json");

  const listProducts = await product.getProducts();

  res.render("home", {
    listProducts,
    title: "List Products",
  });
});

ruta.get("/realtimeproducts", async (req, res) => {
  const socketServer = new Server(httpServer);

  const product = new ProductManager("./src/productos.json");

  socketServer.on("connection", (socket) => {
    console.log("CLIENTE CONECTADO");

    socket.on("products", async (data) => {
      await product.addProduct(data);
    });

  });

  let listProducts = await product.getProducts();

  res.render("realtimeproducts", {
    listProducts,
    title: "List Products RealTime",
  });
});

export default ruta;
