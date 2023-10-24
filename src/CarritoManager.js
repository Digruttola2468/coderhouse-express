import fs, { read } from "fs";

export default class CartsManager {
  constructor(path) {
    this.carrito = [];
    this.path = path;
  }

  async getProductsById(id) {
    //Leemos el archivo
    if (fs.existsSync(this.path)) {
      const getJson = await this.readFile();
      const productById = getJson.find((elem) => elem.id == id);

      if (productById) return productById.products;
      else return { message: "el carrito no existe" };
    } else return { message: "No se puede leer el archivo ya que no existe" };
  }

  async createNewCarrito() {
    //Leemos el archivo
    if (fs.existsSync(this.path)) this.carrito = await this.readFile();
    else return console.error("No se puede leer el archivo ya que no existe");

    if (this.carrito.length !== 0) {
      let getid = this.carrito.length;

      //Sumamos 1
      let id = getid++;

      //Agregamos al array
      this.carrito.push({
        id,
        products: [],
      });
    } else {
      this.carrito.push({
        id: 0,
        products: [],
      });
    }

    try {
      await fs.promises.writeFile(this.path, JSON.stringify(this.carrito));
      return { message: "data add in the db" };
    } catch (error) {
      console.error(error);
      return { message: "no se logro escribir el archivo" };
    }
  }

  async addProductToCarrito(idCarrito, idProduct, quantity = 1) {
    const stock = parseInt(quantity);

    const getListCarritoById = await this.getProductsById(idCarrito);

    const getListCarrito = await this.readFile();

    //Verificar si existe el carrito
    if (getListCarritoById.message) return { message: "el carrito no existe" };

    //Verificar si ya existe un product en el carrito
    const findSameProductSameCarrito = getListCarritoById.find(
      (elem) => elem.product == idProduct
    );
    if (findSameProductSameCarrito) {
      const getQuantity = parseInt(findSameProductSameCarrito.quantity);

      const sumaStock = parseInt(getQuantity) + parseInt(quantity);

      const result = getListCarrito[idCarrito].products.map((elem) => {
        if (elem.product == idProduct) {
          return {
            product: parseInt(idProduct),
            quantity: sumaStock,
          };
        } else return elem;
      });

      getListCarrito[idCarrito].products = result;

      //sobre escribimos el archivo
      fs.promises.writeFile(this.path, JSON.stringify(getListCarrito));

      return {
        message:
          "Estas agregando el mismo producto, ya aumentamos la cantidad del mismo",
      };
    }


    //Agregar al carrito
    this.carrito[idCarrito].products.push({
      product: parseInt(idProduct),
      quantity: stock,
    });

    //Agregamos
    try {
      fs.promises.writeFile(this.path, JSON.stringify(this.carrito));
      return {
        message:
          "Se agrego correctamente al carrito",
      };
    } catch (error) {
      console.error(error);
    }
    
  }

  async readFile() {
    const leerArchivo = await fs.promises.readFile(this.path, "utf-8");
    this.carrito = JSON.parse(leerArchivo);
    return JSON.parse(leerArchivo);
  }
}
