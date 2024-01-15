import carritoModel from "./models/cards.model.js";

export default class Carrito {
    constructor() {}

    get = async () => {
        return await carritoModel.find();
    }

    getOne = async (id) => {
        return await carritoModel.findById(id).populate("products.product");
    }

    insert = async (data) => {
        return await carritoModel.create(data);
    }

    update = async (id, data) => {
        await cardModel.updateOne({ _id: id }, data);
    }

    delete = async (id) => {
        const cardOne = await carritoModel.findOne({ _id: id });

        const filter = cardOne.products.filter((elem) => elem._id != id);
        await carritoModel.updateOne(
          { _id: id },
          {
            products: filter,
          }
        );
    }
}