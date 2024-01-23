export default class CarritoRepository {
    constructor (dao) {
        this.dao = dao;
    }

    getCarritos = async () => {
        return await this.dao.get();
    }

    getOneCarrito = async (id,lean) => {
        return await this.dao.getOne(id,lean);
    }

    updateCarrito = async (id, obj) => {
        return await this.dao.update(id, obj);
    }

    createCarrito = async (carrito) => {
        return await this.dao.insert(carrito);
    }
}