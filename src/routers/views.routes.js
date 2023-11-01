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

  const listProducts = await product.getProducts();

  socketServer.on("connection", (socket) => {
    console.log("CLIENTE CONECTADO");

    socket.on("products", (data) => {
      listProducts.push(data);
    });

  });

  res.render("realtimeproducts", {
    listProducts,
    title: "List Products RealTime",
  });
});

ruta.post("/realtimeproducts", (req, res) => {
  const result = req.query;
//{title,descripcion,code,precio,stock}
  console.log(result);

  res.json(result);
});

export default ruta;
