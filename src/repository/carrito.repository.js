export default class ProductsRepository {
    constructor (dao) {
        this.dao = dao;
    }

    getCarritos = async () => {
        return await this.dao.get();
    }

    getOneCarrito = async () => {
        return await this.dao.getOne();
    }

    updateCarrito = async (id, obj) => {
        return await this.dao.update(id, obj);
    }

    createCarrito = async (carrito) => {
        return await this.dao.insert(carrito);
    }
}