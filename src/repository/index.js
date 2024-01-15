import { Carrito,Products } from '../dao/factory.js';
import CarritoRepository from './carrito.repository.js';
import ProductsRepository from './products.repository.js';

export const carritoService = new CarritoRepository(new Carrito());
export const productsService = new ProductsRepository(new Products());