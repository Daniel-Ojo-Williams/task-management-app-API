import { StatusCodes } from "http-status-codes";
import { CustomError } from "../utils/index.js";

const validateBody = (req, res, next) => {
  try {
    // Get task details
    let { title, description, dueDate, status } = req.body;

    if(req.method == 'PUT' || req.method == 'POST' || req.method == 'PATCH'){
      if (status && !["completed", "pending"].includes(status)) {
        throw new CustomError("Task status can either be completed or pending",
        StatusCodes.UNPROCESSABLE_ENTITY );
      }
    }
    if(req.method == 'PUT' || req.method == 'POST'){
      // validate task details
      if (!title) {
        throw new CustomError(
          "Task title is required to add task",
          StatusCodes.BAD_REQUEST
        );
      }
  
      if (!description) {
        throw new CustomError(
          "Add task description to add task",
          StatusCodes.BAD_REQUEST
        );
      }
  
      if (!dueDate) {
        throw new CustomError("Add task due date to add task",    StatusCodes.BAD_REQUEST
        );
      }
  
      let checkDateFormat = /^\d{1,2}-(0[1-9]|1[0-2])-\d{4}$/;
  
      if(!checkDateFormat.test(dueDate)){
        throw new CustomError('Invalid date format entered, enter date in \'dd-mm-yyyy\' format. i.e 1-02-2023, 3-08-2024.')
        
      }
      req.formatBody = { title, description, dueDate, status };
  
    }
    
    if(!req.path == '/'){
      const { task_id } = req.params;

      if (!task_id) {
        throw new CustomError("Please provide task id to get task", StatusCodes.BAD_REQUEST)
      }
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

export default validateBody;
