import mongoose from "mongoose";

const cardsSchema = mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: ''
                },
                quantity: Number
            }
        ],
        default: []
    }
});

export default mongoose.model('cards', cardsSchema); 