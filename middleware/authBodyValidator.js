import { StatusCodes } from "http-status-codes";
import { CustomError } from "../utils/index.js"

const validateBody = (req, res, next) => {
  try {
    const { fullname, email, password } = req.body;

    // request validation
    if(req.path === '/signup'){
      if (!fullname || fullname.length < 3) {
        throw new CustomError(
          "Fullname must be at least 3 letters long",
          StatusCodes.BAD_REQUEST
        );
      }
    }

    if (!email) {
      throw new CustomError("Please provide email", StatusCodes.BAD_REQUEST);
    }

    if (!password) {
      throw new CustomError(
        "Password must be at least 6 letters long, contain at least one uppercase letter and one number",
        StatusCodes.BAD_REQUEST
      );
    }
    let user = {fullname: req.path === "/signup" ? fullname : "", email, password}
    req.user = user
    next()
  } catch (error) {
    next(error)
  }

}

export default validateBody