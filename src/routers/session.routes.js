import { Router } from "express";
import passport from "passport";
import UserInfoDTO from "../DTO/usuario.dto.js";
import { userService } from "../services/index.repository.js";
import { createHash, isValidPassword } from "../utils.js";

const router = Router();

export function auth(req, res, next) {
  if (req.session?.user) return next();

  return res.redirect("/login");
}

export function authAdmin(req, res, next) {
  const user = req.session?.user;
  if (user) {
    if (user.role.toLowerCase() == "admin") next();
    else if (user.role.toLowerCase() == "premium") next();
    else {
      req.logger.error("No tenes permisos para acceder");
      return res.status(405).json({ message: "Not Allowed", status: "error" });
    }
  } else return res.redirect("/login");
}

export function authUser(req, res, next) {
  const user = req.session?.user;
  if (user) {
    if (user.role.toLowerCase() == "user") next();
    else if (user.role.toLowerCase() == "premium") next();
    else {
      req.logger.error("No tenes permisos para acceder");
      return res.status(405).json({ message: "Not Allowed", status: "error" });
    }
  } else return res.redirect("/login");
}

router.get("/error", async (req, res) => {
  return res.send("Error al Autenticar con Github");
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

router.get("/sendRecoverPassword", auth, async (req, res) => {
  req.session.user.updatePassword = new Date();

  try {
    await userService.sendGmailUpdatePassword(req.session.user._id);

    return res.json({ status: "success", message: "Check your gmail" });
  } catch (error) {
    return res.json({ status: "error", message: "Error al enviar gmail" });
  }
});

router.put(
  "/recoverPassword",
  (req, res, next) => {
    if (req.session.user.updatePassword != null) {
      const dateSendGmail = new Date(req.session.user.updatePassword);
      const dateNow = new Date();

      //Obtener el Dia
      const daySendGmail = dateSendGmail.getDay();
      const dayNow = dateSendGmail.getDay();

      //Obtener la Hora
      const horaSendGmail = dateSendGmail.getHours();
      const horaActual = dateNow.getHours();

      //Comprar los dias para que sea el mismo dia
      if (daySendGmail === dayNow) {
        if (horaActual === horaSendGmail) {
          return next();
        }
      }
    }
    return res.render("/products", {});
  },
  async (req, res) => {
    const { password } = req.body;

    try {
      const user = await userService.findOneUserByGmail(
        req.session.user.email,
        true
      );

      //Si no existe el usuario
      if (!user) return res.render("/login", {});

      //Si la contraseña es igual q al del usuario
      if (isValidPassword(user, password))
        return res.status(400).json({
          status: "error",
          message: "No se puede colocar la misma contraseña",
        });

      const passwordHash = createHash(password);

      try {
        //Actualizar el usuario con la nueva contraseña
        await userService.updatePassword(user._id, passwordHash);

        const userUpdate = await userService.findOneUserById(
          req.session.user._id
        );

        req.session.user = userUpdate;
      } catch (error) {
        return res
          .status(500)
          .json({ status: "error", message: "No se actualizo la contraseña" });
      }

      return res.redirect("/products");
    } catch (error) {
      return res
        .status(400)
        .json({ status: "error", message: "Credenciales Invalidos" });
    }
  }
);

router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/" }),
  async (req, res) => {
    return res.redirect("/products");
  }
);

router.get("/logout", async (req, res) => {
  try {
    await userService.updateLastConnection(req.session.user._id);
  } catch (error) {}

  req.session.destroy((err) => {
    if (err)
      return res.status(500).json({ status: "error", message: "Logout Error" });

    return res.redirect("/");
  });
});

router.get("/current", auth, (req, res) => {
  return res.json(req.session.user);
});

export default router;
