export default class ProductsRepository {
    constructor (dao) {
        this.dao = dao;
    }

    getCarritos = async () => {
        return await this.dao.get();
    }

    createCarrito = async (carrito) => {
        return await this.dao.insert(carrito);
    }
}