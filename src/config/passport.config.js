import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import passportJwt from "passport-jwt";
import jwt from "jsonwebtoken";

import { createHash, isValidPassword } from "../utils.js";
import { carritoService, userService } from "../services/index.js";
import config from "./config.js";

const LocalStrategy = local.Strategy;
const PassportJWT = passportJwt.Strategy;
const ExtractJWT = passportJwt.ExtractJwt;

const inicializePassword = () => {
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: config.GITHUB_CLIENT_ID,
        clientSecret: config.GITHUB_CLIENT_SECRET,
        callbackURL: config.CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Buscar si existe un usuario
          const user = await userService.findOneUserByGmail(
            profile._json.email
          );
          // Si existe
          if (user) {
            //Generar un Token y enviarlo junto a los datos del usuario
            const token = jwt.sign(user, config.JWT_SECRET);
            return done(null, { ...user, token });
          }
          // Si no existe un usuario, Creamos uno

          // Creamos un carrito vacio y le agregamos su cart: ObjectId()
          const result = await carritoService.createCarrito({ products: [] });

          const newUser = await userService.newUser({
            first_name: profile._json.name,
            last_name: "",
            email: profile._json.email,
            age: null,
            password: "",
            role: "user",
            cart: result._id,
          });

          return done(null, newUser);
        } catch (error) {
          return done("Error to login with github");
        }
      }
    )
  );

  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true, //Acceso a req como middleware
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          //Buscamos si existe un usuario
          const user = await userService.findOneUserByGmail(username);
          // Si existe => Retornar como user False
          if (user) return done(null, false);

          try {
            //Creamos el carrito para el nuevo usuario
            const result = await carritoService.createCarrito({ products: [] });

            const newUser = {
              first_name,
              last_name,
              email,
              age,
              password: createHash(password),
              cart: result._id,
            };

            // El role por defecto es user
            let role = "user";
            // Si se registra un usuario con los datos del admin - Colocar el role como admin
            if (
              email == config.USER_ADMIN_GMAIL &&
              password == config.USER_ADMIN_PASSW
            )
              role = "admin";

            const user = await userService.newUser({ ...newUser, role });

            return done(null, user);
          } catch (error) {
            return res
              .status(500)
              .json({ status: "error", message: "No se creo el usuario" });
          }
        } catch (error) {
          done("Error to register\n" + error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await userService.findOneUserByGmail(username, true);

          if (!user) return done(null, false);

          if (!isValidPassword(user, password)) return done(null, false);

          //Update Last Connection
          await userService.updateLastConnection(user._id);

          const token = jwt.sign(user, config.JWT_SECRET);

          return done(null, { ...user, token });
        } catch (error) {
          return done("Error Login: " + error);
        }
      }
    )
  );

  passport.use(
    "jwt",
    new PassportJWT(
      {
        secretOrKey: config.JWT_SECRET,
        jwtFromRequest: ExtractJWT.fromUrlQueryParameter("secret_token"),
      },
      async (token, done) => {
        try {
          return done(null, token.user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "current",
    new LocalStrategy(
      { passReqToCallback: true },
      (req, username, password, done) => {}
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    const user = await userService.findOneUserById(id);
    done(null, user);
  });
};

export default inicializePassword;
