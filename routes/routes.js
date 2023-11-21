import express from 'express';
import { createTask, getAllTasks, getTask } from '../controllers/tasks.js';


const router = express.Router();

router.route('/getAllTasks').get(getAllTasks)
router.route('/createTask').post(createTask)
router.route('/getTask/:task_id').get(getTask)

export default router