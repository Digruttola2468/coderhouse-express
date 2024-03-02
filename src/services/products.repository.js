import ProductInsertDto from "../DTO/products.dto.js";

export default class ProductsRepository {
  constructor(productDAO) {
    this.productDAO = productDAO;
  }

  getProducts = async () => {
    return await this.productDAO.get();
  };

  getOne = async (id, lean = false) => {
    return await this.productDAO.getOne(id, lean);
  };

  getPaginateProducts = async (page, limit, lean) => {
    return await this.productDAO.getPaginate(page, limit, lean);
  };

  getProductsOrderPrice = async (order, limit) => {
    return await this.productDAO.getOrderPrice(order, limit);
  };

  createProducts = async (product) => {
    return await this.productDAO.insert(product);
  };

  updateProducts = async (id, obj, user) => {
    if (user.role.toLowerCase() == "premium") {
      const product = await this.getOne(id);
      
      if (product.owner == user.email)
        return await this.productDAO.update(id, obj);
      else throw new Error();
    } else return await this.productDAO.update(id, obj);
  };

  deleteOne = async (id, user) => {
    if (user.role.toLowerCase() == "premium") {
      const product = await this.getOne(id);

      if (product.owner == user.email) return await this.productDAO.delete(id);
      else throw new Error();
    } else return await this.productDAO.delete(id);
  };
}
