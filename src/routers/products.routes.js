import { Router } from "express";
import ProductManager from "../ProductManager.js";
import productModel from "../models/products.model.js";

const ruta = Router();

const product = new ProductManager("./src/productos.json");

ruta.get("/products", async (req, res) => {
  try {
    const { query, sort } = req.query;

    const limit = parseInt(req.query?.limit ?? 10);
    const page = parseInt(req.query?.page ?? 1);

    const products = await productModel.paginate(
      {},
      {
        limit,
        page,
      }
    );

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
      //buscar por todos los que tenga una sierta categoria o nombre
    }
    if (sort) {
      let order = 0;
      if (sort.toLowerCase() === "asc") order = 1;
      if (sort.toLowerCase() === "desc") order = -1;

      if (order == 1 || order == -1) {
        const result = await productModel.aggregate([
          { $sort: { price: order } },
          { $limit: limit },
        ]);

        enviar.payload = result;
      }
    }

    res.send(enviar);
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error", message: "Something Wrong" });
  }
});

ruta.get("/product/:pid", async (req, res) => {
  try {
    const { pid } = req.params;

    const productOne = await productModel.findOne({ _id: pid });

    res.send(productOne);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Ocurrio un error en el servidor" });
  }
});

ruta.post("/products", async (req, res) => {
  const {
    title,
    description,
    code,
    price,
    status,
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

  console.log(object);

  try {
    const result = await productModel.insertOne(object);

    console.log(result);

    res.json({ message: "success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "error: no se logro leer el archivo" });
  }
});

ruta.put("/products/:pid", async (req, res) => {
  const body = req.body;
  const pid = req.params.pid;

  try {
    const result = await productModel.updateOne({ _id: pid }, body);
    console.log(result);
    return res.json({ message: "update success" });
  } catch (error) {
    return res.status(404).json({ message: "not found" });
  }
});

ruta.delete("/products/:pid", async (req, res) => {
  const id = req.params.pid;

  try {
    const result = await productModel.deleteOne({ _id: id });
    console.log(result);
    return res.json({ message: "delete success" });
  } catch (error) {
    return res.status(404).json({ message: "not found" });
  }
});

export default ruta;
