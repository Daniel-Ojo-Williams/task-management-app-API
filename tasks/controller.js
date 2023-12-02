import { StatusCodes } from "http-status-codes";
import Users from "../models/users.js";
import Tasks from "../models/tasks.js";
import { asyncWrapper } from "../utils/index.js";


export const createTask = asyncWrapper(async (req, res) => {
    const userId = req.user_id
    const { title, description, dueDate, completed } = req.body;

    const task = {
      title,
      description,
      dueDate,
      completed,
      userId,
    }
    // const task = await Tasks.create({
    //   title,
    //   description,
    //   dueDate,
    //   completed,
    //   userId,
    // })

    // console.log(task)
    res
      .status(StatusCodes.CREATED)
      .json({
        message: "Task saved succesfully",
        task,
      });
})


export const getAllTasks = asyncWrapper(async (req, res) => {
    const userId = req.user_id
    
    const tasks = await Tasks.find({userId})

    if(!tasks.length > 0){
      return res.status(StatusCodes.OK).json({message: 'You do not have any tasks, create tasks to get started', tasks})
    }

    res.status(StatusCodes.OK).json({message:'Success', tasks, 'num_of_tasks': tasks.length})
})

export const getTask = asyncWrapper(async (req, res) => {

    const { task_id } = req.params

    if(!task_id){
      return res.status(StatusCodes.BAD_REQUEST).json({message: 'Please provide task id to get task'})
    }

    const task = await Tasks.findOne({_id: task_id})

    if(!task){
      return res.status(StatusCodes.BAD_REQUEST).json({message: 'Invalid task id, please try again with a valid task id'})
    }

    res.status(StatusCodes.OK).json({message:'Success', task})
})

export const updateTask = (req, res) => {
  try {
    const { user } = req.body;

    const { task_id } = req.params

    if(!task_id){
      return res.status(StatusCodes.BAD_REQUEST).json({message: 'Please provide task id to get task'})
    }

    const task = user.tasks.find(task => task.id === task_id)
    
    if(!task){
      return res.status(StatusCodes.BAD_REQUEST).json({message: 'Invalid task id, please try again with a valid task id'})
    }

    const { title, description, status, due_date } = req.body

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
      id:task_id, title, description, due_date, status: status || 'pending'
    }

    const update_user = {
      ...user,
      tasks: user.tasks.map(task => (task.id === task_id ? task_update : task))
    }

    const user_index = Users.indexOf(user)

    

    Users.splice(user_index, 1, update_user)

    res.status(StatusCodes.OK).json({message: 'Task updated successfully', updated_task: task_update})


  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: error.message})
  }
}


export const deleteTask = (req, res) => {
  try {

    const { user } = req.body

    const { task_id } = req.params

    if(!task_id){
      return res.status(StatusCodes.BAD_REQUEST).json({message: 'Please provide task id to get task'})
    }

    const task = user.tasks.find(task => task.id === task_id)
    
    if(!task){
      return res.status(StatusCodes.BAD_REQUEST).json({message: 'Task with provided id not found'})
    }

    const updated_user = {
      ...user,
      tasks: user.tasks.filter(task => task.id !== task_id)
    }

    const user_index = Users.indexOf(user)

    Users.splice(user_index, 1, updated_user)

    res.status(StatusCodes.OK).json({message: 'Task deleted successfully'})
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message)
  }

}