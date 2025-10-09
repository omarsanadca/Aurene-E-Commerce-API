const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.status || 500;
  const errorMessage = err.message || "Something went wrong";
  const errors = err.errors;
  res.status(statusCode).json({ message: errorMessage, errors });
};

export default errorMiddleware;
