import fs from "fs";

export default class ProductManager {
  constructor(path) {
    this.products = [];
    this.path = path;
  }

  async addProduct(object) {
    const { title, description, price, thumbnail, code, stock } = object;

    //Valida los campos vacios
    if (!title || !description || !price || !code || !stock) return;

    if (fs.existsSync(this.path)) {
      const leerArchivo = await fs.promises.readFile(this.path, "utf-8");
      const getJson = JSON.parse(leerArchivo);
      this.products = getJson;
    } else return console.error("No se puede leer el archivo ya que no existe");

    //Si la lista NO esta vacia
    if (this.products.length !== 0) {
      //Verificamos si se repite el atributo code
      let isincludesamecode = this.products.filter((elem) => elem.code == code);

      //Si no se repite ningun codigo del producto
      if (isincludesamecode.length === 0) {
        //Obtenemos la cantidad de elementos que tiene el array
        let getid = this.products.length;

        //Sumamos 1
        let id = getid++;

        //Agregamos al array
        this.products.push({
          id,
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
        });
      } else
        return console.error(
          `The code ${isincludesamecode[0].code} already exists`
        );
    } else {
      this.products.push({
        id: 0,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      });
    }

    try {
      await fs.promises.writeFile(this.path, JSON.stringify(this.products));
      return { message: "data add in the db" };
    } catch (error) {
      console.error(error);
      return { message: "no se logro escribir el archivo" };
    }
  }

  async updateProduct(id, object) {
    if (fs.existsSync(this.path)) {
      const leerArchivo = await fs.promises.readFile(this.path, "utf-8");
      const getJson = JSON.parse(leerArchivo);
      let productById = getJson.find((elem) => elem.id == id);

      if (productById) {
        let enviar = {};

        if (object.title != null) enviar.title = object.title;
        else enviar.title = productById.title;

        if (object.description != null) enviar.description = object.description;
        else enviar.description = productById.description;

        if (object.price != null) enviar.price = object.price;
        else enviar.price = productById.price;

        if (object.code != null) enviar.code = object.code;
        else enviar.code = productById.code;

        if (object.stock != null) enviar.stock = object.stock;
        else enviar.stock = productById.stock;

        if (object.thumbnail != null) enviar.thumbnail = object.thumbnail;
        else enviar.thumbnail = productById.thumbnail;

        const update = getJson.map((elem) => {
          if (elem.id == id) return { id: parseInt(id), ...enviar };
          else return elem;
        });

        //sobre escribimos el archivo
        fs.promises.writeFile(this.path, JSON.stringify(update));
      } else
        return console.error("No se puede leer el archivo ya que no existe");
    }
  }

  async deleteProduct(pid) {
    if (fs.existsSync(this.path)) {
      const leerArchivo = await fs.promises.readFile(this.path, "utf-8");
      const getListProducts = JSON.parse(leerArchivo);

      const productById = getListProducts.find((elem) => elem.id == pid);

      if (productById) {
        //eliminando el producto
        //filtramos el array obteniendo todos los datos menos el de id enviado
        const deleteProductById = getListProducts.filter(
          (elem) => elem.id != pid
        );

        //sobre escribimos el archivo
        fs.promises.writeFile(
          this.path,
          JSON.stringify([...deleteProductById])
        );
      } else console.error("Not Found");
    } else return console.error("No se puede leer el archivo ya que no existe");
  }

  async getProducts() {
    if (fs.existsSync(this.path)) {
      const leerArchivo = await fs.promises.readFile(this.path, "utf-8");
      const getJson = JSON.parse(leerArchivo);
      return getJson;
    } else console.error("No se puede leer el archivo ya que no existe");
  }

  async getProductById(id) {
    if (fs.existsSync(this.path)) {
      try {
        const leerArchivo = await fs.promises.readFile(this.path, "utf-8");
        const getJson = JSON.parse(leerArchivo);

        const productById = getJson.find((elem) => elem.id == id);

        if (productById) return productById;
        else return { message: "el producto no existe" };
      } catch (error) {
        return { message: "Ocurrio un error al leer el archivo" };
      }
    } else return { message: "No se puede leer el archivo ya que no existe" };
  }
}
