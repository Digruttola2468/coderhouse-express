import express from "express";
import ProductsRouter from './routers/products.routes.js'
import CarritoRouter from './routers/carrito.routes.js'

const servidor = express();

servidor.use(express.json())

servidor.use('/api', ProductsRouter);
servidor.use('/api', CarritoRouter)

servidor.listen(8080, () => console.log("Listening PORT 8080"));
