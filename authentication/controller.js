import { StatusCodes } from 'http-status-codes'
import bcrypt from 'bcrypt'
import Users from '../models/users.js'
import { nanoid } from 'nanoid';

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

  if(!password){
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Password must be at least 6 letters long, contain at least one uppercase letter and one number'
    })
  }

  if(Users.some(user => user.personal_info.email === email)){
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Account with email already exists'
    })
  }

  // encrypt password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds)

  const user_id = nanoid(6)

  // save user
  const user = formatData(user_id, fullname, email, hashedPassword)
  Users.push(user)
  
  res.status(StatusCodes.CREATED).json({message: 'User saved successfully', data: {id: user_id, fullname, email} })

  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message)
  }
}

export const signin = async (req, res) => {
  try {
      
    const { email, password } = req.body

    if(!email) {
      return res.status(StatusCodes.BAD_REQUEST).json({message: 'Enter Email Address'})
    }

    const user = Users.find(user => user.personal_info.email === email)

    if(!user){
      return res.status(StatusCodes.BAD_REQUEST).json({message: 'Account not found'})
    }

    const isMatch = await bcrypt.compare(password, user.personal_info.password)

    if(!isMatch){
      return res.status(StatusCodes.FORBIDDEN).json({message: 'Invalid credentials'})
    }

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