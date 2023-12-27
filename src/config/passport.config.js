import passport from "passport";
import local from "passport-local";
import UserModel from "../models/user.model.js";
import {
  createHash,
  isValidPassword,
} from "../utils.js";
import GitHubStrategy from "passport-github2";
import cardsModel from "../models/cards.model.js";
import passportJwt from "passport-jwt";

const LocalStrategy = local.Strategy;
const PassportJWT = passportJwt.Strategy;

const inicializePassword = () => {
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "458dd2c8a17338952980",
        clientSecret: "1fbee1d442e07a85aa9f8e3fcc1352c50a9bff71",
        callbackURL: "http://localhost:8080/api/session/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await UserModel.findOne({ email: profile._json.email });
          if (user) return done(null, user);

          const result = await cardsModel.create({ products: [] });

          const newUser = await UserModel.create({
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
          const user = await UserModel.findOne({ email: username });
          if (user) return done(null, false);

          //Creamos el carrito
          try {
            const result = await cardsModel.create({ products: [] });

            const newUser = {
              first_name,
              last_name,
              email,
              age,
              password: createHash(password),
              cart: result._id,
            };

            let role = "user";
            if (email == "adminCoder@coder.com" && password == "adminCod3r123")
              role = "admin";

            const user = await UserModel.create({ ...newUser, role });

            return done(null, user);
          } catch (error) {
            console.error(error);
            res
              .status(500)
              .json({ message: "error: no se logro leer el archivo" });
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
          const user = await UserModel.findOne({ email: username })
            .lean()
            .exec();
          if (!user) return done(null, false);

          if (!isValidPassword(user, password)) return done(null, false);

          return done(null, user);
        } catch (error) {
          return done("Error Login: " + error);
        }
      }
    )
  );

  passport.use(
    "current",
    new LocalStrategy(
      { passReqToCallback: true },
      (req, username, password, done) => {
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    const user = await UserModel.findById(id);
    done(null, user);
  });
};

export default inicializePassword;
