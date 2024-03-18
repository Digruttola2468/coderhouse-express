import { generateRandomString } from "../utils.js";

export default class TicketRepository {
  constructor(dao, mailModule) {
    this.dao = dao;
    this.mailModule = mailModule;
  }

  async generateTicket(user, data) {
    const dateActual = new Date();

    const randomCod = generateRandomString();

    let html = `
    <h1>Ticket ${randomCod} </h1>
    <div>  
      <p> Muchas gracias por tu compra , a continuacion te mostraremos los datos de la compra </p>
      <p> <b>Usuario: </b> ${data.purchaser} </p>
      <p> <b>Fecha: </b> ${dateActual} </p>
      <p> <b>Code: </b> ${randomCod} </p>
      <p> <b>Precio: </b> ${data.amount}USD </p>
    </div>
    `;

    await this.mailModule.send(
      user,
      `Ticket ${randomCod}, Gracias por tu compra 😎`,
      html
    );

    return await this.dao.insert({
      ...data,
      purchase_datetime: dateActual,
      code: randomCod,
    });
  }
}
