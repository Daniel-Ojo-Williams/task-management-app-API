import { StatusCodes } from 'http-status-codes'
import bcrypt from 'bcrypt'
import Users from '../models/users.js'
import jwt from 'jsonwebtoken'
import { asyncWrapper, CustomError } from '../utils/index.js'
import 'dotenv/config'

export const signup = asyncWrapper(async (req, res) => {
  const {fullname, email, password} = req.user
  
  const emailExists = await Users.findOne({ email });

  if (emailExists) {
    throw new CustomError(
      "User with email already exists, Login.",
      StatusCodes.CONFLICT
    );
  }
  // encrypt password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds)

  // save user  
  const user = await Users.create({fullname, email, password: hashedPassword})

  const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)

  req.session.token = token
  
  res.status(StatusCodes.CREATED).json({message: 'User saved successfully', data: { fullname, email} })
})


export const signin = asyncWrapper(async (req, res) => {
    const { email, password } = req.user;

    const user = await Users.findOne({email})

    if(!user){
      throw new CustomError('Account not found', StatusCodes.NOT_FOUND)
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
      throw new CustomError('Invalid credentials', StatusCodes.UNAUTHORIZED)
    }

    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);

    req.session.token = token;

    res.status(StatusCodes.OK).json({message: 'User logged in successfully', data: {
      fullname: user.fullname,
      email: user.email,
      tasks: user.tasks,
      'num_of_tasks': user.tasks.length
      }
    })
})