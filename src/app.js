import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import handlebars from 'express-handlebars';

import ProductsRouter from "./routers/products.routes.js";
import CarritoRouter from "./routers/carrito.routes.js";

import viewsRouter from "./routers/views.routes.js";
import sessionRouter from './routers/session.routes.js'; 

//Inicializamos Express
const servidor = express();
const MONGOOSE_URL =
  "mongodb+srv://ivansandigruttola:Me53RuCg9hI35FjA@cursoprueba.lauxayp.mongodb.net/";
const MONGO_DB = "coderExpress"

//
servidor.use(express.json());
servidor.use(express.urlencoded({ extended: true }));

//Inicializamos el motor de plantillas
servidor.engine("hbs", handlebars.engine({extname: '.hbs'}));
servidor.set("views", "./src/views");
servidor.set("view engine", "hbs");

//Configuracion de las mongo session
servidor.use(
  session({
    store: MongoStore.create({
      mongoUrl: MONGOOSE_URL,
      dbName: MONGO_DB,
    }),
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

//Establecemos la carpeta /static como publica
servidor.use("/static", express.static("./src/public"));

//Agregamos las rutas middleware
servidor.use(viewsRouter);
servidor.use("/api", ProductsRouter);
servidor.use("/api", CarritoRouter);

servidor.use('/api/session', sessionRouter);

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
