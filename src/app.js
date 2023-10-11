const express = require("express");
const ProductManager = require("./ProductManager.js");

const product = new ProductManager("./src/database.txt");

const servidor = express();

servidor.get("/products", async (req, res) => {
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

servidor.get("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const getProductsManager = await product.getProductById(id);

    return res.send(getProductsManager);
  } catch (error) {
    console.error(error);
    return res.status(500).json({message: 'Ocurrio un error en el servidor'})
  }
});

servidor.listen(8080, () => console.log("Listening PORT 8080"));
