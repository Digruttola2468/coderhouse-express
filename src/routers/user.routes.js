import { Router } from "express";
import { userService } from "../services/index.repository.js";

const ruta = Router();

ruta.put("/premium/:uid", async (req, res) => {
  let user = req.session?.user;
  const uid = req.params.uid;

  try {
    const updateUserRole = await userService.updateRoleUser(uid);

    if (updateUserRole.modifiedCount >= 1) {
      if (user?._id == uid) {
        if (user.role == "user") user.role = "premium";
        else if (user.role == "premium") user.role = "user";
      }

      return res.json({ status: "success", message: "User Updated" });
    } else return res.json({ status: "error", message: "Error Update User" });
  } catch (error) {
    return res.json({ status: "error", message: "Error Update User" });
  }
});

//Permita Subir uno o multiples archivos
ruta.post('/:uid/documents', (req,res) => {

})

export default ruta;
