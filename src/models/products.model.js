import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    thumbnail: String,
    code: {
        type: String,
        unique: true
    },
    stock: Number,
    categoria: String,
    disponible: Boolean
});

productSchema.plugin(mongoosePaginate);

export default mongoose.model('products', productSchema); 