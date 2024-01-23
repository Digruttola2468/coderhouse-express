import { Carrito,Products, Ticket } from '../dao/factory.js';
import CarritoRepository from './carrito.repository.js';
import ProductsRepository from './products.repository.js';
import TicketRepository from './ticket.repository.js';

export const carritoService = new CarritoRepository(new Carrito());
export const productsService = new ProductsRepository(new Products());
export const ticketService = new TicketRepository(new Ticket())