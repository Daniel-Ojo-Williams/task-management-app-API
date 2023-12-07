import { StatusCodes } from "http-status-codes"


const globalErrorHandler = (error, req, res, next) => {
  let statusCode = error.statusCode || 500
  let message = error.message || "Internal server error"
  if(error.code == 23505){
    message = 'Account with the email address already exists, Log in'
    statusCode = StatusCodes.CONFLICT
  }
  return res.status(statusCode).json(message)
}

export default globalErrorHandler