import mongoose from 'mongoose'
import chai from 'chai'
import config from '../config/config.js'

mongoose.connect(config.mongoURL, {dbName: config.mongoDBName})

const expect = chai.expect;

describe('Testing Permissos /api/carts', () => {
    describe('Role: user', () => {
        it('POST Agregar un producto al carrito correspondiente', () => {})
        
        it('UPDATE Actualizar la cantidad del producto dentro del carrito', () => {})

        it('DELETE Eliminar el producto del carrito', () => {})
    })

    describe('Role: admin', () => {
        it('POST El admin no debera agregar un producto al carrito', () => {})
    })

    describe('Role: premium', () => {
        it('POST el usuario premium puede agregar productos que no son propios al carrito', () => {})

        it('POST el usuario premium NO puede agregar productos propios al carrito', () => {})

        it('UPDATE Actualizar la cantidad del producto dentro del carrito', () => {})

        it('DELETE Eliminar el producto del carrito', () => {})
    })
})
