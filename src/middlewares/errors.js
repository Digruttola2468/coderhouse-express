import { ENUM_ERRORS } from "../errors/enums.js";

export default (error, req, res, next) => {
  console.log(error);

  switch (error.code) {
    case ENUM_ERRORS.INVALID_TYPES_ERROR:
      res
        .status(400)
        .send({ status: "Error", error: error.name, cause: error.cause });
      break;
    default:
      res.status(500).send({
        status: "error",
        error: "Something Wrong",
      });
      break;
  }
};