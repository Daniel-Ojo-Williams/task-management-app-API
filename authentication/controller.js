import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import User from "../models/Users.js";
import jwt from "jsonwebtoken";
import { asyncWrapper, CustomError } from "../utils/index.js";
import "dotenv/config";

export const signup = asyncWrapper(async (req, res) => {
  const { fullname, email, password } = req.user;

  
  // encrypt password
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  // save user
  let user = new User(fullname, email, passwordHash);
  user = await user.createUser()
  console.log(user)

  const token = jwt.sign({ _id: user.userid }, process.env.TOKEN_SECRET);

  req.session.token = token;

  res
    .status(StatusCodes.CREATED)
    .json({ message: "User saved successfully", data: { fullname, email } });
});

export const signin = asyncWrapper(async (req, res) => {
  const { email, password } = req.user;

  const user = await User.findOne(email);
  
  if(!user) {
    throw new CustomError("User does not exist, create Account", StatusCodes.UNAUTHORIZED);
  }

  const isMatch = await bcrypt.compare(password, user.passwordhash);

  if (!isMatch) {
    throw new CustomError("Invalid credentials", StatusCodes.UNAUTHORIZED);
  }

  const token = jwt.sign({ _id: user.userid }, process.env.TOKEN_SECRET);

  req.session.token = token;

  res.status(StatusCodes.OK).json({
    message: "User logged in successfully",
    data: {
      fullname: user.fullname,
      email: user.email,
    },
  });
});
