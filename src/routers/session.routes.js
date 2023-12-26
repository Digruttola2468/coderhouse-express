import { Router } from "express";
import passport from "passport";

const router = Router();
const PRIVATE_KEY = "codErHoUsExpressCourseIvan4321";

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
    return res.cookie("token", req.accessToken).redirect("/products");
  }
);

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.send("Logout Error");

    return res.redirect("/");
  });
});

router.get("/current", (req, res) => {
  //Obtenemos de la cookie
  const token = req.token;

  let decoredToken = {};

  try {
    decoredToken = jwt.verify(token, PRIVATE_KEY);
  } catch {}

  return res.json(decoredToken);
});

export default router;
