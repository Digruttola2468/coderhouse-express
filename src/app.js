import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import passport from "passport";
import __dirname from "./utils.js";

// --- PASSPORT ---
import inicializePassword from "./config/passport.config.js";

// --- Routers ---
import ProductsRouter from "./routers/products.routes.js";
import CarritoRouter from "./routers/carrito.routes.js";
import viewsRouter from "./routers/views.routes.js";
import sessionRouter from "./routers/session.routes.js";
import userRouter from "./routers/user.routes.js";
import paymentRoute from "./routers/payment.routes.js";

// --- LOGGER ---
import {
  middlewareDevLogger,
  middlewareProdLogger,
} from "./middlewares/logger.js";

// --- SWAGGER ---
import swaggerJSDoc from "swagger-jsdoc";
import SwaggerUiExpress from "swagger-ui-express";

// --- DOTENV ---
import config from "./config/config.js";

// --- HandleErrors ---
import errors from "./middlewares/errors.js";

//Inicializamos Express
const servidor = express();

//Establecer uso de JSON
servidor.use(express.json());
//servidor.use(express.urlencoded({ extended: true }));

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

//Establecemos la carpeta /static como publica
servidor.use("/static", express.static("./src/public"));

// PASSPORT
inicializePassword();

// LOGGER
servidor.use(middlewareDevLogger);
servidor.get("/loggerTest", (req, res) => {
  req.logger.debug("DEBUG");
  req.logger.http("HTTP");
  req.logger.info("INFO");
  req.logger.warning("WARNING");
  req.logger.error("ERRORS");
  req.logger.fatal("FATAL");

  res.send("Loggers Test Send");
});

const specs = swaggerJSDoc({
  definition: {
    info: {
      title: "Documentacion Del E-Commerce 🛒",
      description: "",
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
});

// Configuramos la documentacion de nuestra aplicacion
servidor.use(
  "/api/docs",
  SwaggerUiExpress.serve,
  SwaggerUiExpress.setup(specs)
);

//Agregamos las rutas middleware
servidor.use("/api/session", sessionRouter);
servidor.use("/api/users", userRouter);
servidor.use("/api/products", ProductsRouter);
servidor.use("/api/carts", CarritoRouter);
servidor.use("/api/payment", paymentRoute);
servidor.use(viewsRouter);

servidor.use(errors);

//Conectamos a mongoDB
mongoose
  .connect(config.mongoURL, { dbName: config.mongoDBName })
  .then(() => {
    // Listen on `port` and 0.0.0.0
    servidor.listen(config.PORT, "0.0.0.0", function () {
      console.log("SERVIDOR ECOMMERCE CODERHOUSE");
    });
  })
  .catch((e) => {});
