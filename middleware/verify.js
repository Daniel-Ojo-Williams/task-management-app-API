import Users from "../models/users.js";
import { StatusCodes } from "http-status-codes";
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { CustomError } from "../utils/index.js";

const verify = (req, res, next) => {
  try {
    const token = req.session?.token

    if(!token){
      throw new CustomError('Please log in if you have an account or Create Account', StatusCodes.UNAUTHORIZED)
    }
    
    const user_id = jwt.verify(token, process.env.TOKEN_SECRET)
    
    if(!user_id) {
      throw new CustomError('Could not parse token, Please Log in again', StatusCodes.UNAUTHORIZED)
    }

    req.user_id = user_id._id

    next()

  } catch (error){
    throw new CustomError(error.message)
  }
}

export default verify