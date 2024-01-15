import ProductInsertDao from "../DTO/products.dto.js";

export default class ProductsRepository {
    constructor (dao) {
        this.dao = dao;
    }

    getProducts = async () => {
        return await this.dao.get();
    }

    createProducts = async (product) => {
        const productsToInsert = new ProductInsertDao(product);
        return await this.dao.insert(productsToInsert);
    }
}