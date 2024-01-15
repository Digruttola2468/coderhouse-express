import productModel from "./models/products.model.js";

export default class Products {
  constructor() {}

  get = async () => {
    return await productModel.find();
  };

  getOne = async (id) => {
    return await productModel.findOne({ _id: id });
  };

  getPaginate = async (page, limit, lean = false) => {
    return await productModel.paginate(
      {},
      {
        limit,
        page,
        lean
      }
    );
  };

  getOrderPrice = async (order, limit) => {
    return await productModel.aggregate([
      { $sort: { price: order } },
      { $limit: limit },
    ]);
  }

  insert = async (data) => {
    return await productModel.create(data);
  };

  update = async (id, data) => {
    return await productModel.updateOne({ _id: id }, data);
  };

  delete = async (id) => {
    return await productModel.deleteOne({ _id: id });
  };
}
