import express from "express";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTask,
  updateTask,
  updateTaskStatus,
} from "./controller.js";

const router = express.Router();

router.route("/").get(getAllTasks);
router.route("/createTask").post(createTask);
router
  .route("/:task_id")
  .get(getTask)
  .put(updateTask)
  .delete(deleteTask)
  .patch(updateTaskStatus);

export default router;
