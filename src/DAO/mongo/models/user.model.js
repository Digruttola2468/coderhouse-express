import mongoose from "mongoose";

const UserModel = mongoose.model('users', new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String,
    cart: String,
    role: String,
    documents: {
        type: [
            {
                name: String,
                reference: String
            }
        ],
        default: []
    },
    last_connection: Date
}))

export default UserModel;