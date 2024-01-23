import { generateRandomString } from "../utils.js";

export default class TicketRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async generateTicket(data) {
    const dateActual = new Date();

    const randomCod = generateRandomString();

    console.log({
      ...data,
      purchase_datetime: dateActual,
      code: randomCod,
    });

    return await this.dao.insert({
      ...data,
      purchase_datetime: dateActual,
      code: randomCod,
    });
  }
}
