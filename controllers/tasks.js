import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import 'dotenv/config'
import Users from "../models/users.js";
import { nanoid } from "nanoid";

export const getAllTasks = (req, res) => {
  console.log(req.headers)
}

export const createTask = (req, res) => {
  try {
    const { token } = req.cookies;
  
    if(!token){
      return res.status(StatusCodes.UNAUTHORIZED).json({message: 'Invlalid token'});
    }

    const { id } = jwt.verify(token, process.env.PRIVATE_KEY)
    console.log(id)

    const user = Users.find(user => user.id === id)

    if(!user){
      res.json('user not found')
    }

    // Get task details
    const { title, description, due_date, status } = req.body

    // validate task details
    if(!title){
      return res.status(StatusCodes.BAD_REQUEST).json({message: 'Task title is required to add task'})
    }

    if(!description){
      return res.status(StatusCodes.BAD_REQUEST).json({message: 'Add task description'})
    }

    if(!due_date){
      return res.status(StatusCodes.BAD_REQUEST).json({message: 'Task requires a due date'})
    }

    const task_status = status || 'pending'

    const task_id = nanoid()

    user.tasks.push({id: task_id, title, description, due_date, status: task_status})

    res.status(StatusCodes.CREATED).json({message: 'Task saved succesfully', task: user.tasks.find(task => task.id === task_id)})

  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message)
  }
}