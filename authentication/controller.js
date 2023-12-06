import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import db from "../db/connectdb.js";
import jwt from "jsonwebtoken";
import { asyncWrapper, CustomError } from "../utils/index.js";
import "dotenv/config";

export const signup = asyncWrapper(async (req, res) => {
  const { fullname, email, password } = req.user;

  // check if email exist already
  const { rows } = await db.query('SELECT * FROM "users" WHERE email = $1', [
    email,
  ]);

  if (rows.length > 0) {
    throw new CustomError(
      "User with email already exists, Login.",
      StatusCodes.CONFLICT
    );
  }
  // encrypt password
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  // save user
  const response = await db.query(
    'INSERT INTO "users" (fullname, email, passwordHash) VALUES ($1, $2, $3) RETURNING userId, fullname, email',
    [fullname, email, passwordHash]
  );

  const user = response.rows[0];

  const token = jwt.sign({ _id: user.userid }, process.env.TOKEN_SECRET);

  req.session.token = token;

  res
    .status(StatusCodes.CREATED)
    .json({ message: "User saved successfully", data: { fullname, email } });
});

export const signin = asyncWrapper(async (req, res) => {
  const { email, password } = req.user;

  const { rows } = await db.query('SELECT * FROM "users" WHERE email = $1', [
    email,
  ]);

  if (!rows.length > 0) {
    throw new CustomError("Account not found", StatusCodes.NOT_FOUND);
  }

  const user = rows[0];

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
