import { StatusCodes } from "http-status-codes";
import db from "../db/connectdb.js";
import { asyncWrapper } from "../utils/index.js";

export const createTask = asyncWrapper(async (req, res) => {
  const userId = req.user_id;
  let { title, description, dueDate, status } = req.formatBody;

  const response = await db.query(
    "INSERT INTO tasks (title, description, userId, status, dueDate) VALUES ($1, $2, $3, $4, TO_DATE($5, 'DD-MM-YYYY')) RETURNING *",
    [title, description, userId, status, dueDate]
  );

  const task = response.rows[0];

  res.status(StatusCodes.CREATED).json({
    message: "Task saved succesfully",
    task,
  });
});

export const getAllTasks = asyncWrapper(async (req, res) => {
  const userId = req.user_id;

  const response = await db.query("SELECT * FROM tasks WHERE userid = $1", [
    userId,
  ]);

  const tasks = response.rows;

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

  if (!task_id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please provide task id to get task" });
  }

  const response = await db.query("SELECT * FROM tasks WHERE taskid = $1", [
    task_id,
  ]);

  const task = response.rows[0];

  if (!task) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid task id, please try again with a valid task id",
    });
  }

  res.status(StatusCodes.OK).json({ message: "Success", task });
});

export const updateTask = asyncWrapper(async (req, res) => {
  const userId = req.user_id;

  const { task_id } = req.params;

  if (!task_id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please provide task id to get task" });
  }
  let { title, description, dueDate, status } = req.formatBody;

  const response = await db.query(
    "UPDATE tasks SET title = $1, description = $2, dueDate = TO_DATE($3, 'DD-MM-YYYY'), status = $4 WHERE taskid = $5 AND userid = $6 RETURNING *",
    [title, description, dueDate, status, task_id, userId]
  );

  const task = response?.rows[0];

  if (!task) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid task id, please try again with a valid task id",
    });
  }

  res
    .status(StatusCodes.OK)
    .json({ message: "Task updated successfully", updated_task: task });
});

export const deleteTask = asyncWrapper(async (req, res) => {
  const { task_id } = req.params;
  const userId = req.user_id;

  if (!task_id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please provide task id to get task" });
  }

  const task = await db.query(
    "DELETE FROM tasks WHERE taskid = $1 AND userid = $2",
    [task_id, userId]
  );

  if (!task) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Task with provided id not found" });
  }

  res.status(StatusCodes.OK).json({ message: "Task deleted successfully" });
});
