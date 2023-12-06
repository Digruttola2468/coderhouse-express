import { Router } from "express";
import ProductManager from "../ProductManager.js";
import { Server } from "socket.io";
import httpServer from "../app.js";

import productsModel from "../models/products.model.js";
import cardsModel from "../models/cards.model.js";

const ruta = Router();

// Midlewares
function justPublicWitoutSession(req, res, next) {
  if (req.session?.user) return res.redirect("/products");

  return next();
}

function auth(req, res, next) {
  if (req.session?.user) return next();

  return res.redirect("/login");
}

ruta.get("/realtimeproducts",auth, async (req, res) => {
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

ruta.get("/products",auth, async (req, res) => {
  const limit = parseInt(req.query?.limit ?? 10);
  const page = parseInt(req.query?.page ?? 1);

  const user = req.session.user;

  const products = await productsModel.paginate(
    {},
    {
      limit,
      page,
      lean: true,
    }
  );

  const prevLink =
    products.prevPage != null
      ? `/products/?page=${products.prevPage}&limit=${products.limit}`
      : null;
  const nextLink =
    products.nextPage != null
      ? `/products/?page=${products.nextPage}&limit=${products.limit}`
      : null;

  products.prevLink = prevLink;
  products.nextLink = nextLink;

  res.render("products", {
    data: products,
    user
  });
});

ruta.get("/product/:pid",auth, async (req, res) => {
  try {
    const { pid } = req.params;

    const productOne = await productsModel.findOne({ _id: pid }).lean();

    res.render("oneProduct", {
      data: productOne,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Ocurrio un error en el servidor" });
  }
});

ruta.get("/carts/:cid",auth, async (req, res) => {
  const cid = req.params.cid;
  try {
    const carrito = await cardsModel
      .findById(cid)
      .populate("products.product")
      .lean();
    res.render("cards", {
      data: carrito,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "error: no se logro leer" });
  }
});

//                Views Session

// Renders ----------------------------------------------------------
ruta.get("/", justPublicWitoutSession, (req, res) => {
  return res.render("index", {});
});

ruta.get("/login", justPublicWitoutSession, (req, res) => {
  return res.render("login", {});
});

ruta.get("/register", justPublicWitoutSession, (req, res) => {
  return res.render("register", {});
});

export default ruta;
