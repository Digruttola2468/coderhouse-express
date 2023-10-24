import { Router } from "express";
import CartsManager from "../CarritoManager.js";
import ProductManager from "../ProductManager.js";

const ruta = Router();

const carts = new CartsManager("./src/carrito.json");
const products = new ProductManager('./src/productos.json')

ruta.get("/carts/:cid", async (req, res) => {
  const cid = req.params.cid;
  try {
    const result = await carts.getProductsById(cid);
    res.json(result);
  } catch (error) {
    console.log(error);
  }
  
});

ruta.post("/carts", async (req, res) => {
    try {
      const result = await carts.createNewCarrito();
      res.json(result)
    } catch (error) {
      
    }
});

ruta.post('/:cid/product/:pid',async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const quantity = req.query.quantity;

  const getListProducts = await products.getProductById(pid);

  //Verificar si existe el producto 
  if(getListProducts.message) 
    return res.status(404).json(getListProducts);
  
  try {
    const result = await carts.addProductToCarrito(cid, pid, quantity);
    return res.json(result)
  } catch (error) {
    console.log(error);
  }
})

export default ruta;
