const { default: CarritoMongo } = await import("../DAO/mongo/carrito.mongo.js");
const { default: TicketMongo } = await import("../DAO/mongo/ticket.mongo.js");
const { default: UserMongo } = await import("../DAO/mongo/user.mongo.js");
const { default: ProductsMongo } = await import("../DAO/mongo/products.mongo.js");

import CarritoRepository from './carrito.repository.js';
import ProductsRepository from './products.repository.js';
import TicketRepository from './ticket.repository.js';
import UserRepository from './users.repository.js'

import Mail from "../modules/mail.module.js";
const mailModule = new Mail();

export const carritoService = new CarritoRepository(new CarritoMongo());
export const productsService = new ProductsRepository(new ProductsMongo());
export const ticketService = new TicketRepository(new TicketMongo(), mailModule)
export const userService = new UserRepository(new UserMongo(), mailModule)