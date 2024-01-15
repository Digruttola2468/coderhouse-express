export default class Carrito {
    constructor () {
        this.db = [];
    }

    get = async () => {
        return this.db;
    }

    getOne = async (id) => {
        return this.db.find(elem => elem.id == id)
    }

    insert = async data => {
        data.id = this.db.length + 1;
        this.db.push(data);

        return data;
    }

    update = async (id, data) => {
        const update = this.db.map(elem => {
            if (elem.id == id) return {id, ...data}
            else return elem
        });
        this.db = update;

        return update;
    }

    delete = async (id) => {
        const delet = this.db.filter(elem => elem.id != id);
        this.db = delet;

        return delet
    }
}