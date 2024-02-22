export default class ProductsInsertDTO {
    constructor(products) {
        this.categoria = products?.categoria ?? ''
        this.thumbnail = products?.thumbnail ?? ''
        this.disponible = products?.disponible ?? false
        this.code = products?.code ?? ''
    }
}