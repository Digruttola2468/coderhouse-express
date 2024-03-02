import mongoose from "mongoose";
import {expect} from "chai";
import config from "../config/config.js";
import supertest from "supertest";

mongoose.connect(config.mongoURL, { dbName: config.mongoDBName });

const requester = supertest("http://localhost:8080");

describe("Register new User", () => {
  it("Registrarse y obtener el carrito su _id y que este vacio", () => {});
});

describe("Testing /api/session ", () => {
  describe("Loggin User", () => {
    it("Iniciar sesion un usuario que existe", () => {});
    it("Iniciar sesion un usuario que NO existe", () => {});
  });

  describe("Change Role user", () => {
    it("Cambiar del role User to Premium", () => {});
    it("Cambiar del role Premium to User", () => {});
  });
});
