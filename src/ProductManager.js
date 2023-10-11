const fs = require("fs");

module.exports = class ProductManager {
  constructor(path) {
    this.products = [];
    this.path = path;
  }

  async addProduct(object) {
    const { title, description, price, thumbnail, code, stock } = object;

    //Valida los campos vacios
    if (!title || !description || !price || !thumbnail || !code || !stock)
      return;

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
      return {message: 'data add in the db'}
    } catch (error) {
      console.error(error);
      return {message: 'no se logro escribir el archivo'}
    }
    
  }

  updateProduct(id, object) {
    const { title, description, price, thumbnail, code, stock } = object;
    //Valida los campos vacios
    if (!title || !description || !price || !thumbnail || !code || !stock)
      return;

    if (fs.existsSync(this.path)) {
      fs.promises
        .readFile(this.path, "utf-8")
        .then((result) => {
          const getJson = JSON.parse(result);
          let productById = getJson.find((elem) => elem.id === id);

          if (productById) {
            const update = getJson.map((elem) => {
              if (elem.id == id) return { id, ...object };
              else return elem;
            });

            //sobre escribimos el archivo
            fs.promises.writeFile(this.path, JSON.stringify(update));
          } else console.error("Not Found");
        })
        .catch((e) => console.error(e));
    } else console.error("No se puede leer el archivo ya que no existe");
  }

  deleteProduct(id) {
    if (fs.existsSync(this.path)) {
      fs.promises
        .readFile(this.path, "utf-8")
        .then((result) => {
          const getJson = JSON.parse(result);
          const productById = getJson.find((elem) => elem.id === id);

          if (productById) {
            //eliminando el producto
            //filtramos el array obteniendo todos los datos menos el de id enviado
            const deleteProductById = getJson.filter((elem) => elem.id !== id);

            //sobre escribimos el archivo
            fs.promises.writeFile(
              this.path,
              JSON.stringify([...deleteProductById])
            );
          } else console.error("Not Found");
        })
        .catch((e) => console.error(e));
    } else console.error("No se puede leer el archivo ya que no existe");
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
        console.error(error);
        return { message: "Ocurrio un error al leer el archivo" };
      }
    } else return { message: "No se puede leer el archivo ya que no existe" };
    
  }
};
