
const globalErrorHandler = (error, req, res, next) => {
  let statusCode = error.statusCode || 500
  return res.status(statusCode).json(error.message)
}

export default globalErrorHandler