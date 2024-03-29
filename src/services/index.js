import { Carrito, Products, Ticket, Users } from '../dao/factory.js';
import CarritoRepository from './carrito.repository.js';
import ProductsRepository from './products.repository.js';
import TicketRepository from './ticket.repository.js';
import UserRepository from './users.repository.js'

import Mail from "../modules/mail.module.js";
const mailModule = new Mail();

export const carritoService = new CarritoRepository(new Carrito());
export const productsService = new ProductsRepository(new Products());
export const ticketService = new TicketRepository(new Ticket(), mailModule)
export const userService = new UserRepository(new Users(), mailModule)