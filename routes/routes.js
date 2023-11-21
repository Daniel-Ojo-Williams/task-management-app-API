import express from 'express';
import { createTask, getAllTasks, getTask, updateTask } from '../controllers/tasks.js';


const router = express.Router();

router.route('/').get(getAllTasks)
router.route('/createTask').post(createTask)
router.route('/:task_id').get(getTask).put(updateTask)

export default router