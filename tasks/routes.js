import express from 'express';
import { createTask, deleteTask, getAllTasks, getTask, updateTask } from './controller.js';
import { validateTaskBody } from '../middleware/index.js'

const router = express.Router();

router.route('/').get(getAllTasks)
router.route('/createTask').post(validateTaskBody, createTask)
router.route('/:task_id').get(getTask).put(validateTaskBody, updateTask).delete(deleteTask)

export default router