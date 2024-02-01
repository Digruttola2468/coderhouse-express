import { Router } from "express";
import { productsService } from "../services/index.js";
import { authAdmin } from "./session.routes.js";

const ruta = Router();

ruta.get("/", async (req, res) => {
  try {
    const { query, sort } = req.query;

    const limit = parseInt(req.query?.limit ?? 10);
    const page = parseInt(req.query?.page ?? 1);

    const products = await productsService.getPaginateProducts(page, limit);

    const prevLink =
      products.prevPage != null
        ? `/api/products/?page=${products.prevPage}`
        : null;
    const nextLink =
      products.nextPage != null
        ? `/api/products/?page=${products.nextPage}`
        : null;

    const enviar = {
      status: "success",
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink,
      nextLink,
    };

    if (query) {
      //buscar por todos los que tenga una cierta categoria o nombre
    }
    if (sort) {
      let order = 0;
      if (sort.toLowerCase() === "asc") order = 1;
      if (sort.toLowerCase() === "desc") order = -1;

      if (order == 1 || order == -1)
        enviar.payload = await productsService.getProductsOrderPrice(
          order,
          limit
        );
    }

    return res.send(enviar);
  } catch (error) {
    req.logger.fatal("No se obtuvio los datos de manera de paginacion");
    res.status(500).send({ status: "error", message: "Something Wrong" });
  }
});

ruta.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;

    const productOne = await productsService.getOne(pid);

    return res.send(productOne);
  } catch (error) {
    req.logger.error("No existe el producto");
    return res.status(404).json({ message: "No existe el producto" });
  }
});

ruta.post("/", authAdmin, async (req, res) => {
  const {
    title,
    description,
    code,
    price,
    stock,
    categoria,
    thumbnail,
    disponible,
  } = req.body;

  //Valida los campos vacios
  if (!title || !description || !price || !code || !stock)
    return res.status(400).json({ message: "Completar los campos" });

  const object = {
    title,
    description,
    code,
    price,
    stock,
    categoria,
    thumbnail,
    disponible,
  };

  try {
    await productsService.createProducts(object);

    return res.json({ message: "success" });
  } catch (error) {
    req.logger.error("No se creo el producto");
    res.status(400).json({ message: "Campos Invalidos" });
  }
});

ruta.put("/:pid", authAdmin, async (req, res) => {
  const body = req.body;
  const pid = req.params.pid;

  try {
    await productsService.updateProducts(pid, body);
    return res.json({ message: "update success" });
  } catch (error) {
    req.logger.error("No se actualizo el producto");
    return res.status(404).json({ message: "not found" });
  }
});

ruta.delete("/:pid", authAdmin, async (req, res) => {
  const pid = req.params.pid;

  try {
    await productsService.deleteOne(pid);
    return res.json({ message: "delete success" });
  } catch (error) {
    req.logger.error("No existe el producto");
    return res.status(404).json({ message: "Not Found Product" });
  }
});

export default ruta;
