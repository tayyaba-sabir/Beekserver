class ApplicationError extends Error {
    constructor(message, status) {
      super(message);
      this.name = 'ApplicationError';
      this.status = status || 500;
    }
  }
  
  module.exports = { ApplicationError };
  