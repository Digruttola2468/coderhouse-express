import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";

//
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default __dirname;

//Create Hash
export const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

// Validate Hash
export const isValidPassword = (user, password) => {
  return bcrypt.compareSync(password, user.password);
};

// GenerateRandomString
export const generateRandomString = () => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let i = 0;
  while (i < 10) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    i += 1;
  }
  return result;
};
