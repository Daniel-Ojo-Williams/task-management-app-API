import { StatusCodes } from "http-status-codes";
import Users from "../models/users.js";
import Tasks from "../models/tasks.js";
import { asyncWrapper } from "../utils/index.js";


export const createTask = asyncWrapper(async (req, res) => {
    const userId = req.user_id
    const { title, description, dueDate, completed } =
      req.body;

    const task = await Tasks.create({
      title,
      description,
      dueDate,
      completed,
      userId,
    })

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

export const updateTask = asyncWrapper((req, res) => {
    const userId = req.user_id

    const { task_id } = req.params

    if(!task_id){
      return res.status(StatusCodes.BAD_REQUEST).json({message: 'Please provide task id to get task'})
    }

    const task = Tasks.findOneAndUpdate({_id: task_id}, {...req.body}, {new: true})
    
    if(!task){
      return res.status(StatusCodes.BAD_REQUEST).json({message: 'Invalid task id, please try again with a valid task id'})
    }

    res.status(StatusCodes.OK).json({message: 'Task updated successfully', updated_task: task})

})


export const deleteTask = asyncWrapper(async (req, res) => {

    const { task_id } = req.params

    if(!task_id){
      return res.status(StatusCodes.BAD_REQUEST).json({message: 'Please provide task id to get task'})
    }

    const task = await Tasks.findOneAndDelete({_id: task_id})
    
    if(!task){
      return res.status(StatusCodes.BAD_REQUEST).json({message: 'Task with provided id not found'})
    }

    res.status(StatusCodes.OK).json({message: 'Task deleted successfully'})
})