import { Router } from "express";
import ProductManager from "../ProductManager.js";

const ruta = Router();

const product = new ProductManager("./src/productos.json");

ruta.get("/products", async (req, res) => {
  try {
    const limit = req.query.limit;

    const getProductsManager = await product.getProducts();

    if (limit) {
      const filterAllProductManager = getProductsManager.filter(
        (elem) => elem.id < limit
      );
      return res.send(filterAllProductManager);
    }

    return res.send(getProductsManager);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "ocurrio un error en el servidor" });
  }
});

ruta.get("/products/:pid", async (req, res) => {
  try {
    const id = req.params.pid;

    const getProductsManager = await product.getProductById(id);

    return res.send(getProductsManager);
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
    category,
    thumbnails,
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
    category,
    thumbnails,
  };

  try {
    const result = await product.addProduct(object);
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
    product.updateProduct(pid,body);
    return res.json({ message: "update success" });
  } catch (error) {
    return res.status(404).json({ message: "not found" });
  }
});

ruta.delete("/products/:pid", (req, res) => {
  const id = req.params.pid;

  try {
    product.deleteProduct(id);
    return res.json({ message: "delete success" });
  } catch (error) {
    return res.status(404).json({ message: "not found" });
  }
});

export default ruta;
