import { StatusCodes } from 'http-status-codes'
import bcrypt from 'bcrypt'
import Users from '../models/users.js'
import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken';
import 'dotenv/config.js'


let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password
const private_key = process.env.PRIVATE_KEY || 'PRIVATE_KEY'

const formatData = (id, fullname, email, password) => {
  return {
    id: id,
    personal_info: {
      fullname: fullname,
      email: email,
      password: password
    },
    tasks: []
  }
}

export const signup = async (req, res) => {
  try {
    const { fullname, email, password } = req.body

  // request validation
  if(!fullname || fullname.length < 3){
    return res.status(StatusCodes.BAD_REQUEST).json({message: 'Fullname must be at least 3 letters long'})
  }

  if(!email){
    return res.status(StatusCodes.BAD_REQUEST).json({message: 'Please provide email'})
  }

  if(!emailRegex.test(email)){
    return res.status(StatusCodes.BAD_REQUEST).json({message: 'Invalid Email'})
  }

  if(!passwordRegex.test(password)){
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Password must be at least 6 letters long, contain at least one uppercase letter and one number'
    })
  }

  if(Users.some(user => user.personal_info.email === email)){
    // console.log('yes')
    // console.log(Users)
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Account with email already exists'
    })
  }

  // encrypt password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds)

  const user_id = nanoid()

  // save user
  const user = formatData(user_id, fullname, email, hashedPassword)
  Users.push(user)

  // generate token containing user id
  const token = jwt.sign({id: user_id}, private_key)

  // encapsulate token in cookie sent to the browser
  res.cookie('token', token, {secure: true, httpOnly: true, sameSite: 'strict'})
  
  res.status(StatusCodes.CREATED).json({message: 'User saved successfully', data: {id: user_id, fullname, email} })

  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message)
  }
}

export const signin = async (req, res) => {
  try {
      
    const { email, password } = req.body

    if(!emailRegex.test(email)) {
      return res.status(StatusCodes.BAD_REQUEST).json({message: 'Invalid Email'})
    }

    const user = Users.find(user => user.personal_info.email === email)

    if(!user){
      return res.status(StatusCodes.BAD_REQUEST).json({message: 'Account not found'})
    }

    const isMatch = await bcrypt.compare(password, user.personal_info.password)

    if(!isMatch){
      return res.status(StatusCodes.FORBIDDEN).json({message: 'Invalid credentials'})
    }

    // generate token containing user id
    
    const token = jwt.sign({id: user.id}, private_key)

    // encapsulate token in cookie sent to the browser
    res.cookie('token', token, {secure: true, httpOnly: true, sameSite: 'strict'})
  
    res.status(StatusCodes.OK).json({data: {
      id: user.id,
      fullname: user.personal_info.fullname,
      email: user.personal_info.email,
      tasks: user.tasks,
      'num_of_tasks': user.tasks.length
      }
    })

  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message) 
  }
}