import { StatusCodes } from "http-status-codes";
import { CustomError } from "../utils/index.js";

const validateBody = (req, res, next) => {
try {
  // Get task details
  let { title, description, dueDate, completed } = req.body;

  // validate task details
  if (!title) {
    throw new CustomError("Task title is required to add task", StatusCodes.BAD_REQUEST);
  }
  
  if (!description) {
    throw new CustomError("Add task description to add task", StatusCodes.BAD_REQUEST);
  }
  
  if (!dueDate) {
    throw new CustomError("Add task due date to add task", StatusCodes.BAD_REQUEST);
  }

  let checkDateFormat = /^[A-Z][a-z]{2}\s\d{1,2}\s\d{4}/;

  if(!checkDateFormat.test(dueDate)){
    throw new CustomError('Invalid date format entered, enter date in \'Mmm Dd YYYY\' format. i.e Nov 12 2023, Jan 1 2012.')
  }

  let formatDueDate = dueDate.split('');

  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  

  const month = months.indexOf(formatDueDate[0])
  if(months < 0){
    throw new CustomError('Invalid month entered, enter month between Jan - Dec')
  }
  const day = parseInt(formatDueDate[1])
  const year = parseInt(formatDueDate[2])
  

  dueDate = new Date(month, day, year)

  req.formattedTaskBody = {title, description, dueDate, completed}

  next();
} catch (error) {
  next(error)
}
}

export default validateBody