import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PRIVATE_KEY = "codErHoUsExpressCourseIvan4321";

export default __dirname;

//Create Hash
export const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

export const isValidPassword = (user, password) => {
  return bcrypt.compareSync(password, user.password);
};

export const generateToken = (user) => {
  const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "24h" });
  return token;
};

export const authToken = (req, res, next) => {
  const token = req.headers.Authorization;
  if (!token) return res.status(401).send({ error: "No Auth" });

  jwt.verify(token, PRIVATE_KEY, (error, credencials) => {
    if (error) return res.status(403).send({ error: "Not Authorized" });
    req.user = credencials.user;
    next();
  });
};
