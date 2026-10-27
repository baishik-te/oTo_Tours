/**
 * 404 Not Found Middleware
 */
function notFoundHandler(req, res, next) {
  const error = new Error(`Resource not found at ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

/**
 * Global Error Handling Middleware
 */
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  const response = {
    success: false,
    error: {
      message,
      statusCode
    }
  };

  if (process.env.NODE_ENV === 'development' && statusCode === 500) {
    response.error.stack = err.stack;
  }

  return res.status(statusCode).json(response);
}

module.exports = {
  notFoundHandler,
  errorHandler
};
