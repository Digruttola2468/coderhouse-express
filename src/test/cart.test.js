import mongoose from "mongoose";
import { expect } from "chai";
import config from "../config/config.js";
import supertest from "supertest";

mongoose.connect(config.mongoURL, { dbName: config.mongoDBName });

const requester = supertest("http://localhost:8080");

const pid = "65d695769ab51c43029ca81b";

describe("Role: user", () => {
  const userLogin = { email: "ivandigruttola7@gmail.com", password: "secret" };

  let cookie = "";
  let cid = "";

  before(async () => {
    const result = await requester.post("/api/session/login").send(userLogin);
    //65ad6ede046e0ed48cf91d1a
    const resultCookie = result.headers["set-cookie"][0];
    cookie = resultCookie.split("=")[1].split(";")[0];

    const othe = await requester
      .get("/api/session/current")
      .set("Cookie", [`connect.sid=${cookie}`]);

    cid = othe.body.cart;
  });

  it("POST Agregar un producto al carrito correspondiente", async () => {
    const { ok, status, body } = await requester
      .post(`/api/carts/${cid}/product/${pid}?quantity=10`)
      .set("Cookie", [`connect.sid=${cookie}`]);

    expect(ok).to.be.ok;
  });

  //it("UPDATE Actualizar la cantidad del producto dentro del carrito", async () => {});

  it("DELETE Eliminar el producto del carrito", async () => {
    const { ok, status, body } = await requester
      .delete(`/api/carts/${cid}/product/${pid}`)
      .set("Cookie", [`connect.sid=${cookie}`]);

    expect(ok).to.be.ok;
  });
});

describe("Role: admin", () => {
  const userLogin = { email: "santiago@gmail.com", password: "123456" };

  let cookie = "";
  let cid = "";

  before(async () => {
    const result = await requester.post("/api/session/login").send(userLogin);

    const resultCookie = result.headers["set-cookie"][0];
    cookie = resultCookie.split("=")[1].split(";")[0];

    const othe = await requester
      .get("/api/session/current")
      .set("Cookie", [`connect.sid=${cookie}`]);

    cid = othe.body.cart;
  });
  it("POST El admin no debera agregar un producto al carrito", async () => {
    const { ok } = await requester
      .post(`/api/carts/${cid}/product/${pid}?quantity=10`)
      .set("Cookie", [`connect.sid=${cookie}`]);
    expect(!ok).to.be.ok;
  });
});

describe("Role: premium", () => {
  const userLogin = { email: "digruttolabrisa@gmail.com", password: "123456" };

  let cookie = "";
  let cid = "";

  before(async () => {
    const result = await requester.post("/api/session/login").send(userLogin);

    const resultCookie = result.headers["set-cookie"][0];
    cookie = resultCookie.split("=")[1].split(";")[0];

    const othe = await requester
      .get("/api/session/current")
      .set("Cookie", [`connect.sid=${cookie}`]);

    cid = othe.body.cart;
  });

  it("POST el usuario premium puede agregar productos que no son propios al carrito", async () => {
    const { ok, status, body } = await requester
      .post(`/api/carts/${cid}/product/${pid}?quantity=10`)
      .set("Cookie", [`connect.sid=${cookie}`]);

    expect(ok).to.be.ok;
  });

  it("POST el usuario premium NO puede agregar productos propios al carrito", async () => {
    const { ok, status, body } = await requester
      .post(`/api/carts/${cid}/product/65e36c79ca04e96689a71614?quantity=10`)
      .set("Cookie", [`connect.sid=${cookie}`]);

    expect(!ok).to.be.ok;
  });

  //it("UPDATE Actualizar la cantidad del producto dentro del carrito", async () => {});

  it("DELETE Eliminar el producto del carrito", async () => {
    const { ok, status, body } = await requester
      .delete(`/api/carts/${cid}/product/${pid}`)
      .set("Cookie", [`connect.sid=${cookie}`]);

    expect(ok).to.be.ok;
  });
});
