const errorHandler = (err, req, res, next) => {
    console.error(err);
  
    let statusCode = 500;
    let errorMessage = 'Internal Server Error';
  
    if (err.name === 'UnauthorizedError') {
      statusCode = 401;
      errorMessage = 'Unauthorized';
    } else if (err.name === 'SequelizeValidationError') {
      statusCode = 400;
      errorMessage = err.errors.map((error) => error.message).join(', ');
    } else if (err.name === 'SequelizeUniqueConstraintError') {
      statusCode = 400;
      errorMessage = 'Duplicate entry. Please check your input.';
    } else if (err.name === 'ApplicationError') {
      statusCode = err.status || 500;
      errorMessage = err.message || 'Internal Server Error';
    }
  
    res.status(statusCode).json({ error: errorMessage });
  };
  
  module.exports = errorHandler;
  