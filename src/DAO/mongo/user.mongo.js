import userModel from "./models/user.model.js";

export default class UserMongo {
  constructor() {}

  get = async () => {
    return await userModel.find();
  };

  getOneById = async (uid) => {
    return await userModel.findById(uid);
  };

  getOneByEmail = async (email, lean = false) => {
    if (lean) return await userModel.findOne({ email }).lean().exec();
    else return await userModel.findOne({ email })
  }

  insert = async (data) => {
    return await userModel.create(data);
  };

  update = async (id, data) => {
    return await userModel.updateOne({ _id: id }, data);
  };

  delete = async (id) => {
    return await userModel.deleteOne({ _id: id });
  };
}
