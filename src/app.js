import express from "express";
import handlebars from "express-handlebars";

import ProductsRouter from "./routers/products.routes.js";
import CarritoRouter from "./routers/carrito.routes.js";
import viewsRouter from './routers/views.routes.js'
import { Server } from "socket.io";

const servidor = express();

//Inicializamos el motor de plantillas
servidor.engine("handlebars", handlebars.engine());
servidor.set("views", "./src/views");
servidor.set("view engine", "handlebars");

servidor.use("/static", express.static("./src/public"));
servidor.use(express.json());

servidor.use(viewsRouter);
servidor.use("/api", ProductsRouter);
servidor.use("/api", CarritoRouter);

export const httpServer = servidor.listen(8080, () => console.log("Listening PORT 8080"));