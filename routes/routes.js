import express from 'express';
import { getAllTasks } from '../controllers/tasks.js';


const router = express.Router();

router.route('/getAllTasks').get(getAllTasks)

export default router