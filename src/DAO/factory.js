import config from "../config/config.js";

export let Products;
export let Carrito;

switch (config.persistenci) {
  case "MEMORY":
    const { default: ProductsMemory } = await import(
      "./memory/products.memory.js"
    );
    const { default: CarritoMemory } = await import(
      "./memory/carrito.memory.js"
    );
    Products = ProductsMemory;
    Carrito = CarritoMemory;
    break;

  case "FILE":
    const { default: ProductsFile } = await import("./file/products.file.js");
    const { default: CarritoFile } = await import("./file/carrito.file.js");
    Products = ProductsFile;
    Carrito = CarritoFile;
    break;

  case "MONGO_DB":
    const { default: ProductsMongo } = await import(
      "./mongo/products.mongo.js"
    );
    const { default: CarritoMongo } = await import("./mongo/carrito.mongo.js");
    Products = ProductsMongo;
    Carrito = CarritoMongo;
    break;

  default:
    throw new Error("Persistencie is not configured !!");
}
