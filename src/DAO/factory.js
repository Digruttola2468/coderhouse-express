import config from "../config/config.js";

export let Products;
export let Carrito;
export let Ticket;

switch (config.persistenci) {
  case "MEMORY":
    const { default: ProductsMemory } = await import(
      "./memory/products.memory.js"
    );
    const { default: CarritoMemory } = await import(
      "./memory/carrito.memory.js"
    );
    const { default: TicketMemory } = await import(
      "./memory/ticket.memory.js"
    );
    Products = ProductsMemory;
    Carrito = CarritoMemory;
    Ticket = TicketMemory;
    break;

  case "FILE":
    const { default: ProductsFile } = await import("./file/products.file.js");
    const { default: CarritoFile } = await import("./file/carrito.file.js");
    const { default: TicketFile } = await import("./file/ticket.file.js");
    Products = ProductsFile;
    Carrito = CarritoFile;
    Ticket = TicketFile;
    break;

  case "MONGO_DB":
    const { default: ProductsMongo } = await import("./mongo/products.mongo.js");
    const { default: CarritoMongo } = await import("./mongo/carrito.mongo.js");
    const { default: TicketMongo } = await import("./mongo/ticket.mongo.js");
    Products = ProductsMongo;
    Carrito = CarritoMongo;
    Ticket = TicketMongo;
    break;

  default:
    throw new Error("Persistencie is not configured !!");
}
