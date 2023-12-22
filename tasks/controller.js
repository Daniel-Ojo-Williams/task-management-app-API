import { StatusCodes } from "http-status-codes";
import Tasks from '../models/Tasks.js'
import { asyncWrapper, CustomError } from "../utils/index.js";
import { redisClient } from "../index.js";

export const createTask = asyncWrapper(async (req, res) => {
  const userId = req.user_id;
  let { title, description, dueDate, status } = req.formatBody;

  let task = new Tasks(title, description, dueDate, status, userId)

  task = await task.createTask()

  res.status(StatusCodes.CREATED).json({
    message: "Task saved succesfully",
    task,
  });
});

export const getAllTasks = asyncWrapper(async (req, res) => {
  const userId = req.user_id;

  let tasks = await Tasks.getAllTask(userId)

  if (!tasks.length > 0) {
    return res.status(StatusCodes.OK).json({
      message: "You do not have any tasks, create tasks to get started",
      tasks,
    });
  }

  res
    .status(StatusCodes.OK)
    .json({ message: "Success", tasks, num_of_tasks: tasks.length });
});

export const getTask = asyncWrapper(async (req, res) => {
  const { task_id } = req.params;

  let data;

  // cache hit
  data = await redisClient.get(task_id);
  
  if(data){
    data = JSON.parse(data);
    return res.status(StatusCodes.OK).json({ message: "Success", data });
  }

  data = await Tasks.findOne(task_id)

  if (!data) {
    throw new CustomError("Invalid task id, please try again with a valid task id",StatusCodes.BAD_REQUEST);
  }

  // cache miss
  await redisClient.set(task_id, JSON.stringify(data), { EX: 5 * 24 * 60 * 60 * 1000 });
  res.status(StatusCodes.OK).json({ message: "Success", data });
});

export const updateTask = asyncWrapper(async (req, res) => {
  const userId = req.user_id;

  const { task_id } = req.params;

  let { title, description, dueDate, status } = req.formatBody;

  const task = await Tasks.updateTask(task_id, title, description, userId, status, dueDate)

  if (!task) {
    throw new CustomError(
      "Invalid task id, please try again with a valid task id",
      StatusCodes.BAD_REQUEST
    );
  }

  // check if task is cached
  const exists = await redisClient.exists(task_id);

  if(exists){
    // update task in cache 
   await redisClient.set(task_id, JSON.stringify(data), { EX: 5 * 24 * 60 * 60 * 1000 }); 
  }

  res
    .status(StatusCodes.OK)
    .json({ message: "Task updated successfully", updated_task: task });
});

export const deleteTask = asyncWrapper(async (req, res) => {
  const { task_id } = req.params;
  const userId = req.user_id;

  let task = await Tasks.deleteTask(task_id, userId)
  
  if (!task) {
    throw new CustomError('Task with provided id not found', StatusCodes.BAD_REQUEST)
  }

  // check if task is cached
  const exists = await redisClient.exists(task_id);

  if(exists){
    // delete task in cache
    await redisClient.del(task_id); 
  }
  
  res.status(StatusCodes.OK).json({ message: "Task deleted successfully" });
});

export const updateTaskStatus = asyncWrapper(async (req, res) => {
  const { task_id } = req.params;
  const userId = req.user_id;

  let { status } = req.body
  let task = await Tasks.updateTaskStatus(status, task_id, userId);
  
  if(!task){
    throw new CustomError('Task with provided id not found', StatusCodes.BAD_REQUEST)
  }
  res.status(StatusCodes.OK).json({ message: "Task status updated successfully" });
})