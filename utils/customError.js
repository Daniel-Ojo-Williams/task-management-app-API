import { StatusCodes } from "http-status-codes"

class CustomError extends Error {
  constructor(message, statusCode){
    super(message)
    this.statusCode = statusCode
    Error.captureStackTrace(this, this.constructor)
  }

}

export class ValidationError extends CustomError {
  constructor(message){
    super(message)
    this.statusCode = StatusCodes.UNAUTHORIZED
  }
}

export default CustomError