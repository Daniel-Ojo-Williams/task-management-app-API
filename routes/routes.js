import express from 'express';
import { createTask, getAllTasks } from '../controllers/tasks.js';


const router = express.Router();

router.route('/getAllTasks').get(getAllTasks)
router.route('/createTask').post(createTask)

export default router