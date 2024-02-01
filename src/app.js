import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import passport from "passport";

import inicializePassword from "./config/passport.config.js";

import ProductsRouter from "./routers/products.routes.js";
import CarritoRouter from "./routers/carrito.routes.js";
import viewsRouter from "./routers/views.routes.js";
import sessionRouter from "./routers/session.routes.js";

import cookieParser from "cookie-parser";

import config from "./config/config.js";
import errors from "./middlewares/errors.js";
import {
  middlewareDevLogger,
  middlewareProdLogger,
} from "./middlewares/logger.js";

//Inicializamos Express
const servidor = express();

//
servidor.use(express.json());
servidor.use(express.urlencoded({ extended: true }));

//Inicializamos el motor de plantillas
servidor.engine("hbs", handlebars.engine({ extname: ".hbs" }));
servidor.set("views", "./src/views");
servidor.set("view engine", "hbs");

//Configuracion de las mongo session
servidor.use(
  session({
    store: MongoStore.create({
      mongoUrl: config.mongoURL,
      dbName: config.mongoDBName,
    }),
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
servidor.use(passport.initialize());
servidor.use(passport.session());

//Cookie parser
servidor.use(cookieParser());

//Establecemos la carpeta /static como publica
servidor.use("/static", express.static("./src/public"));

inicializePassword();

servidor.use(middlewareDevLogger);

//Agregamos las rutas middleware
servidor.use("/api/session", sessionRouter);

servidor.use(viewsRouter);
servidor.use("/api/products", ProductsRouter);
servidor.use("/api/carts", CarritoRouter);

servidor.use(errors);

servidor.get("/loggerTest", (req, res) => {
  req.logger.debug("DEBUG");
  req.logger.http("HTTP");
  req.logger.info("INFO");
  req.logger.warning("WARNING");
  req.logger.error("ERRORS");
  req.logger.fatal("FATAL");

  res.send("Loggers Test Send");
});

//Conectamos a mongoDB
let httpServer = null;
mongoose
  .connect(config.mongoURL, { dbName: config.mongoDBName })
  .then(() => {
    //Iniciamos el servidor
    httpServer = servidor.listen(8080, () => {
      console.log("DB Connected 😎");
      console.log(`Listening PORT localhost:${8080}`);
    });
  })
  .catch((e) => {});

export default httpServer;
