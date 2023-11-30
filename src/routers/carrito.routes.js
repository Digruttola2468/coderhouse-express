import { Router } from "express";
import CartsManager from "../CarritoManager.js";
import ProductManager from "../ProductManager.js";

const ruta = Router();

const carts = new CartsManager("./src/carrito.json");
const products = new ProductManager('./src/productos.json')



ruta.get("/carts/:cid", async (req, res) => {
  
  
  
});

ruta.post("/carts", async (req, res) => {
  


});

ruta.post('/:cid/product/:pid',async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const quantity = req.query.quantity;

  
})

ruta.put('/carts/:cid', async (req,res) => {

})

ruta.put('/carts/:cid/products/:pid', async (req,res) => {
  
})

ruta.delete('/carts/:cid/products/:pid', async (req, res) => {

})

ruta.delete('/carts/:cid', async (req, res) => {
  
});

export default ruta;
