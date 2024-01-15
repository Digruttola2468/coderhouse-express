import ProductInsertDao from "../DTO/products.dto.js";

export default class ProductsRepository {
    constructor (dao) {
        this.dao = dao;
    }

    getProducts = async () => {
        return await this.dao.get();
    }

    getOne = async (id) => {
        return await this.dao.getOne(id);
    }

    getPaginateProducts = async (page, limit, lean) => {
        return await this.dao.getPaginate(page, limit, lean);
    }

    getProductsOrderPrice = async (order,limit) => {
        return await this.dao.getOrderPrice(order,limit)
    }

    createProducts = async (product) => {
        const productsToInsert = new ProductInsertDao(product);
        return await this.dao.insert(productsToInsert);
    }

    updateProducts = async (id, obj) => {
        return await this.dao.update(id, obj);
    }

    deleteOne = async (id) => {
        return await this.dao.delete(id)
    }
}