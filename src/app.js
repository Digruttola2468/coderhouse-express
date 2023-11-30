import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";

import ProductsRouter from "./routers/products.routes.js";
import CarritoRouter from "./routers/carrito.routes.js";
import viewsRouter from "./routers/views.routes.js";

//Inicializamos Express
const servidor = express();
const MONGOOSE_URL =
  "mongodb+srv://ivansandigruttola:Z_kaV-upa9ETE4V@cursoprueba.lauxayp.mongodb.net/";

//
servidor.use(express.json());
servidor.use(express.urlencoded({ extended: true }));

//Inicializamos el motor de plantillas
servidor.engine("handlebars", handlebars.engine());
servidor.set("views", "./src/views");
servidor.set("view engine", "handlebars");

//Establecemos la carpeta /static como publica
servidor.use("/static", express.static("./src/public"));

//Agregamos las rutas middleware
servidor.use(viewsRouter);
servidor.use("/api", ProductsRouter);
servidor.use("/api", CarritoRouter);

//Conectamos a mongoDB
let httpServer = null;
mongoose
  .connect(MONGOOSE_URL, { dbName: "coderExpress" })
  .then(() => {
    //Iniciamos el servidor
    httpServer = servidor.listen(8080, () => {
      console.log("DB Connected 😎");
      console.log(`Listening PORT localhost:${8080}`);
    });
  })
  .catch((e) => {});

export default httpServer;
