export default class Products {
  constructor() {
    this.db = [];
  }

  get = async () => {
    return this.db;
  };

  getOne = async (id, lean = false) => {
    return this.db.find((elem) => elem.id == id);
  };

  getPaginate = async (page, limit, lean = false) => {
    const end = page * limit;
    const start = end - limit;

    return this.db.slice(start, end);
  };

  getOrderPrice = async (order, limit) => {
    //ASC
    if (order >= 1) {
      return this.db.sort((a, b) => {
        if (a.price < b.price) {
          return 1;
        }
        if (a.price > b.price) {
          return -1;
        }
        if (a.price == b.price) {
          return 0;
        }
      });
    }
    //DESC
    else {
      return this.db.sort((a, b) => {
        if (a.price > b.price) {
          return 1;
        }
        if (a.price < b.price) {
          return -1;
        }
        if (a.price == b.price) {
          return 0;
        }
      });
    }
  };

  insert = async (data) => {
    data.id = this.db.length + 1;
    this.db.push(data);

    return data;
  };

  update = async (id, data) => {
    const update = this.db.map((elem) => {
      if (elem.id == id) return { id, ...data };
      else return elem;
    });
    this.db = update;

    return update;
  };

  delete = async (id) => {
    const delet = this.db.filter((elem) => elem.id != id);
    this.db = delet;

    return delet;
  };
}