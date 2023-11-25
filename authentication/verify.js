import Users from "../models/users.js";
import { StatusCodes } from "http-status-codes";

const verify = (req, res, next) => {
  try {
    const { user_id } = req.params

    if(!user_id) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Please provide a user id in the request parameter" });
    }

    const user = Users.find(user => user.id === user_id)

    if(!user){
      return res.status(StatusCodes.BAD_REQUEST).json({message: 'user not found'})
    }

    req.body.user = user

    next()

  } catch (error){
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: error.message})
  }
}

export default verify