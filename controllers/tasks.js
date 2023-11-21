import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import 'dotenv/config'
import Users from "../models/users.js";
import { nanoid } from "nanoid";

export const getAllTasks = (req, res) => {
  try {
    const { token } = req.cookies;

    if(!token){
      return res.status(StatusCodes.UNAUTHORIZED).json({message: 'Invlalid token'});
    }

    const { id } = jwt.verify(token, process.env.PRIVATE_KEY)

    const user = Users.find(user => user.id === id)

    if(!user){
      res.json('user not found')
    }

    const tasks = user.tasks

    if(!tasks.length > 0){
      return res.status(StatusCodes.OK).json({message: 'User has no tasks in memory, create tasks to get started'})
    }

    res.status(StatusCodes.OK).json({tasks, 'num_of_tasks': tasks.length})
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: error.message})
  }
}

export const getTask = (req, res) => {
  try {
    const { token } = req.cookies;

    if(!token){
      return res.status(StatusCodes.UNAUTHORIZED).json({message: 'Invlalid token'});
    }

    const { id } = jwt.verify(token, process.env.PRIVATE_KEY)

    const user = Users.find(user => user.id === id)

    if(!user){
      res.json('user not found')
    }

    const { task_id } = req.params

    if(!task_id){
      return res.status(StatusCodes.BAD_REQUEST).json({message: 'Please provide task id to get task'})
    }

    const task = user.tasks.find(task => task.id === task_id)

    if(!task){
      return res.status(StatusCodes.BAD_REQUEST).json({message: 'Invalid task id, please try again with a valid task id'})
    }

    res.status(StatusCodes.OK).json(task)
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: error.message})
  }
}

export const updateTask = (req, res) => {
  try {
    const { token } = req.cookies;

    if(!token){
      return res.status(StatusCodes.UNAUTHORIZED).json({message: 'Invlalid token'});
    }

    const { id } = jwt.verify(token, process.env.PRIVATE_KEY)

    const user = Users.find(user => user.id === id)

    if(!user){
      res.json('user not found')
    }

    const { task_id } = req.params

    if(!task_id){
      return res.status(StatusCodes.BAD_REQUEST).json({message: 'Please provide task id to get task'})
    }

    const task = user.tasks.find(task => task.id === task_id)
    
    if(!task){
      return res.status(StatusCodes.BAD_REQUEST).json({message: 'Invalid task id, please try again with a valid task id'})
    }

    const { title, description, status, due_date } = req.body

    const task_status = status || 'pending'

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


    const task_update = {
      id:task_id, title, description, due_date, status: task_status
    }

    const user_tasks = user.tasks.map(task => {
      return task.id === task_id ? task_update : task
    })

    const update_user = {
      ...user,
      tasks: user_tasks
    }

    const user_index = Users.indexOf(user)

    Users.splice(user_index, 1, update_user)

    res.status(StatusCodes.OK).json({message: 'Task updated successfully', updated_task: task_update, Users})


  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: error.message})
  }
}

export const createTask = (req, res) => {
  try {
    const { token } = req.cookies;
  
    if(!token){
      return res.status(StatusCodes.UNAUTHORIZED).json({message: 'Invlalid token'});
    }

    const { id } = jwt.verify(token, process.env.PRIVATE_KEY)

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