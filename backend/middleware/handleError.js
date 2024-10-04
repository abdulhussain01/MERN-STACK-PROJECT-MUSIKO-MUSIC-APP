class HandleErrors extends Error {
  constructor(message, statusCode) {
    super(message);
    (this.message = message), (this.statusCode = statusCode);
    Error.captureStackTrace(this);
  }
}

export const errorHandler = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new HandleErrors(message, 400);
  }
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is Invalid. Try Again`;
    err = new HandleErrors(message, 400);
  }
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is Expired. Try Login!`;
    err = new HandleErrors(message, 400);
  }
  if (err.name === "CastError") {
    const message = `Invalid ${err.path}`;
    err = new HandleErrors(message, 400);
  }

  const erroMessage = err.erros
    ? Object.values(err.errors)
        .map((error) => error.message)
        .join(" ")
    : err.message;

 
  return res.status(err.statusCode).json({
    success: false,
    message: erroMessage,
  });
};

export default HandleErrors;
