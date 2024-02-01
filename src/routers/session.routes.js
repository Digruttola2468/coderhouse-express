import { Router } from "express";
import passport from "passport";
import UserInfoDTO from "../DTO/usuario.dto.js";

const router = Router();

export function auth(req, res, next) {
  if (req.session?.user) return next();

  return res.redirect("/login");
}

export function authAdmin(req, res, next) {
  const user = req.session?.user;
  if (user) {
    if (user.role.toLowerCase() == "admin") next();
    else {
      req.logger.error("No tenes permisos para acceder");
      return res.status(405).json({ message: "Not Allowed" });
    }
  } else return res.redirect("/login");
}

export function authUser(req, res, next) {
  const user = req.session?.user;
  if (user) {
    if (user.role.toLowerCase() == "user") next();
    else {
      req.logger.error("No tenes permisos para acceder");
      return res.status(405).json({ message: "Not Allowed" });
    }
  } else return res.redirect("/login");
}

router.get("/error", async (req, res) => {
  res.send("Error al Autenticar con Github");
});

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {
    return res.cookie("token", req.accessToken).send("Cookie Created");
  }
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/error" }),
  (req, res) => {
    req.session.user = req.user;
    return res.redirect("/products");
  }
);

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/" }),
  async (req, res) => {
    if (!req.user) return res.status(400).send("Credenciales Invalidos");

    req.session.user = req.user;

    return res.redirect("/products");
  }
);

router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/" }),
  async (req, res) => {
    return res.redirect("/products");
  }
);

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.send("Logout Error");

    return res.redirect("/");
  });
});

router.get("/current", auth, (req, res) => {
  return res.json(new UserInfoDTO(req.session.user));
});

export default router;
