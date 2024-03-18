import { Router } from "express";
import { carritoService, productsService } from "../services/index.js";
import { authAdmin } from "./session.routes.js";

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

/*ruta.get("/realtimeproducts",auth, async (req, res) => {
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
});*/

ruta.get("/products", auth, async (req, res) => {
  const limit = parseInt(req.query?.limit ?? 10);
  const page = parseInt(req.query?.page ?? 1);

  const user = req.session.user;

  let isNewProducto = false;
  if (
    user.role.toLowerCase() == "premium" ||
    user.role.toLowerCase() == "admin"
  )
    isNewProducto = true;

  try {
    const products = await productsService.getPaginateProducts(
      page,
      limit,
      true
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

    return res.render("products", {
      data: products,
      user,
      isNewProducto,
    });
  } catch (error) {
    req.logger.fatal("No se obtuvio los datos con forma de paginacion");
    return res
      .status(500)
      .send({ status: "error", message: "Something Wrong" });
  }
});

ruta.get("/product/:pid", auth, async (req, res) => {
  const { pid } = req.params;
  const user = req.session.user;

  try {
    const productOne = await productsService.getOne(pid, true);

    return res.render("oneProduct", {
      data: productOne,
      cart: user.cart,
    });
  } catch (error) {
    req.logger.error("No existe el producto");
    return res.status(404).json({ message: "No existe el producto" });
  }
});

ruta.get("/carts/:cid", auth, async (req, res) => {
  const cid = req.params.cid;
  try {
    const carrito = await carritoService.getOneCarrito(cid, true);
    return res.render("cards", {
      data: carrito,
    });
  } catch (error) {
    req.logger.error("No existe el carrito");
    res.status(404).json({ message: "error: No existe el carrito" });
  }
});

ruta.get("/newProduct", authAdmin, (req, res) => {
  return res.render("newProduct");
});

ruta.get("/changePassword", auth, (req, res) => {
  return res.render("recoverPassword");
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

ruta.get("/updatePassword", auth, (req, res) => {
  if (req.session.user.updatePassword == null)
    return res.render("index", {});
  else return res.render("recoverPassword", {});
});

export default ruta;
