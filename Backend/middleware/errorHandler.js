import multer from "multer";

export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

export const notFoundHandler = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

export const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  if (statusCode >= 500) {
    console.error("Unhandled server error:", err);
  }

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`,
    });
  }

  if (err.message === "Only image files are allowed.") {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(statusCode).json({
    success: false,
    message: err.isOperational ? err.message : "Internal server error.",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
