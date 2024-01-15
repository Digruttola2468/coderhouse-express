import fs from "fs";

export default class Products {
  constructor(filename = "productos.json") {
    this.filename = filename;
    if (!fs.existsSync(this.filename)) {
      fs.writeFileSync(this.filename, "[]");
    }
  }

  overwriteFile = async (data) => {
    const dbStr = JSON.stringify(data);
    return fs.promises.writeFile(this.filename, dbStr);
  }

  get = async () => {
    return fs.promises
      .readFile(this.filename, { encoding: "utf-8" })
      .then((r) => JSON.parse(r));
  };

  getOne = async (id) => {
    const db = await this.get();

    return db.find((elem) => elem.id == id);
  };

  insert = async () => {
    const db = await this.get();
    let data = this.db.lenght + 1;

    db.push(data);
    return this.overwriteFile(db)
  };

  update = async (id, data) => {
    const db = await this.get();

    const update = db.map((elem) => {
      if (elem.id == id) return { id, ...data }
      else return elem
    });

    return this.overwriteFile(update)
  };

  delete = async (id) => {
    const db = await this.get();

    const delet = db.filter((elem) => elem.id != id);

    return this.overwriteFile(delet)
  };
}
