import mongoose from "mongoose";
import { expect } from "chai";
import config from "../config/config.js";
import supertest from "supertest";

mongoose.connect(config.mongoURL, { dbName: config.mongoDBName });

const requester = supertest("http://localhost:8080");

let newProduct = {
  title: "PS5",
  description: "PlayStation 5",
  code: "PST-005",
  price: "1000",
  stock: "5",
  categoria: "Electronica",
  thumbnail: "",
  disponible: true,
};

describe("Testing Role User ", () => {
  const userLogin = { email: "ivandigruttola7@gmail.com", password: "secret" };

  let cookie = "";

  before(async () => {
    const result = await requester.post("/api/session/login").send(userLogin);
    const resultCookie = result.headers["set-cookie"][0];
    cookie = resultCookie.split("=")[1].split(";")[0];
  });

  it("POST /api/products El usuario no puede agregar un producto", async () => {
    const result = await requester
      .post("/api/products")
      .send(newProduct)
      .set("Cookie", [`connect.sid=${cookie}`]);

    expect(!result.ok).to.be.ok;
  });

  it("DELETE /api/products/:pid El usuario no puede eliminar un producto", async () => {
    const result = await requester
      .delete("/api/products/6567e06969613819196a1147")
      .set("Cookie", [`connect.sid=${cookie}`]);

    expect(!result.ok).to.be.ok;
  });

  it("UPDATE /api/products/:pid El usuario no puede actualizar un producto", async () => {
    const result = await requester
      .put("/api/products/6567e06969613819196a1147")
      .send({ title: "Laptop HP", price: "2032" })
      .set("Cookie", [`connect.sid=${cookie}`]);

    expect(!result.ok).to.be.ok;
  });
});

describe("Testing Role Admin", () => {
  const userLogin = { email: "santiago@gmail.com", password: "123456" };

  let cookie = "";

  before(async () => {
    const result = await requester.post("/api/session/login").send(userLogin);
    const resultCookie = result.headers["set-cookie"][0];
    cookie = resultCookie.split("=")[1].split(";")[0];
  });

  it("POST El admin puede agregar un producto", async () => {
    const { ok, body } = await requester
      .post("/api/products")
      .send(newProduct)
      .set("Cookie", [`connect.sid=${cookie}`]);

    expect(ok).to.be.ok;
    expect(body.payload).to.be.ok;
    expect(body.payload).to.have.property("_id");

    newProduct._id = body.payload._id;
  });

  it("UPDATE /api/products/:pid El admin puede actualizar un producto", async () => {
    const { ok, body } = await requester
      .put(`/api/products/${newProduct._id}`)
      .send({
        title: "IPHONE 7 plus 256GB Negro",
        description:
          "Conoce el iphone 7 plus con una memoria del 256GB 😱 con una camara excelente ",
        price: "200",
      })
      .set("Cookie", [`connect.sid=${cookie}`]);

    expect(ok).to.be.ok;
    expect(body.payload).to.be.ok;
    expect(body.payload)
      .to.have.property("title")
      .eq("IPHONE 7 plus 256GB Negro");
  });

  it("DELETE /api/products/:pid El admin puede eliminar un producto", async () => {
    const { ok, status } = await requester
      .delete(`/api/products/${newProduct._id}`)
      .set("Cookie", [`connect.sid=${cookie}`]);

    expect(ok).to.be.ok;
    expect(status).to.be.eq(200);
  });
});

describe("Testing Role Premium", () => {
  const userLogin = { email: "digruttolabrisa@gmail.com", password: "123456" };

  let cookie = "";

  before(async () => {
    const result = await requester.post("/api/session/login").send(userLogin);
    const resultCookie = result.headers["set-cookie"][0];
    cookie = resultCookie.split("=")[1].split(";")[0];
  });

  it("POST /api/products el usuario premium puede agregar un producto propio con su gmail correspondiente", async () => {
    const { ok, body } = await requester
      .post("/api/products")
      .send(newProduct)
      .set("Cookie", [`connect.sid=${cookie}`]);

    expect(ok).to.be.ok;
    expect(body.payload).to.be.ok;
    expect(body.payload).to.have.property("_id");
    expect(body.payload).to.have.property("owner").eq(userLogin.email);

    newProduct._id = body.payload._id;
  });

  describe("UPDATE /api/products/:pid", () => {
    it("El usuario premium puede modificar los productos q son propios", async () => {
      const { ok, body } = await requester
        .put(`/api/products/${newProduct._id}`)
        .send({
          title: "IPHONE 7 plus 256GB Negro",
          description:
            "Conoce el iphone 7 plus con una memoria del 256GB 😱 con una camara excelente ",
          price: "200",
        })
        .set("Cookie", [`connect.sid=${cookie}`]);

      expect(ok).to.be.ok;
      expect(body.payload).to.be.ok;
      expect(body.payload)
        .to.have.property("title")
        .eq("IPHONE 7 plus 256GB Negro");
      expect(body.payload).to.have.property("owner").eq(userLogin.email);
    });
    it("El usuario premium NO puede modificar los productos q no son propios", async () => {
      const result = await requester
        .put("/api/products/6567e06969613819196a1147")
        .send({ title: "Laptop HP", price: "2032" })
        .set("Cookie", [`connect.sid=${cookie}`]);

      expect(!result.ok).to.be.ok;
    });
  });

  describe("DELETE /api/products/:pid", () => {
    it("El usuario premium NO puede eliminar productos que no son propios", async () => {
      const result = await requester
        .delete("/api/products/6567e06969613819196a1147")
        .set("Cookie", [`connect.sid=${cookie}`]);

      expect(!result.ok).to.be.ok;
    });
    it("El usuario premium puede eliminar productos propios", async () => {
      const { ok, status } = await requester
        .delete(`/api/products/${newProduct._id}`)
        .set("Cookie", [`connect.sid=${cookie}`]);

      expect(ok).to.be.ok;
      expect(status).to.be.eq(200);
    });
  });
});
