import ticketModel from "./models/tickets.model.js";

export default class TicketMongo {
  constructor() {}

  get = async () => {
    return await ticketModel.find();
  };

  getOne = async (id, lean = false) => {
  };

  insert = async (data) => {
    return await ticketModel.create(data);
  };

  update = async (id, data) => {
    await ticketModel.updateOne({ _id: id }, data);
  };

  delete = async (id) => {};
}
