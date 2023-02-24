import { Request, Response, NextFunction } from "express";
import { nodeEnv } from "../config/constants.js";
import config from "../config/index.js";
import logger from "../logs/logger.js";
import { Err } from "../interfaces";
import AppError from "../utils/AppError.js";

const sendErrorDev = (err: Err, req: Request, res: Response) => {
  logger.error(`💥 ${err.stack}`);

  return res.status(err.statusCode).json({
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err: Err, req: Request, res: Response) => {
  if (req.originalUrl.startsWith("/api")) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        statusCode: err.statusCode,
      });
    }

    logger.error(`💥 ${err}`);

    return res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
      statusCode: 500,
    });
  }
  if (err.isOperational) {
    return res.status(err.statusCode).render("error", {
      title: "Something went wrong!",
      msg: err.message,
      statusCode: err.statusCode,
    });
  }

  logger.error(`💥 ${err}`);

  return res.status(err.statusCode).render("error", {
    title: "Something went wrong!",
    msg: "Please try again later.",
    statusCode: err.statusCode,
  });
};

const handleCastErrorDB = (err: Err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const errorController = (
  err: Err,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.body || err.query || err.params) {
    err.statusCode = 400;
    err.status = "fail";
  }

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (config.NODE_ENV === nodeEnv.production) {
    let error = { ...err };
    error.message = err.message;
    if (error.name === "CastError") error = handleCastErrorDB(error);

    sendErrorProd(error, req, res);
  } else {
    sendErrorDev(err, req, res);
  }
};

export default errorController;
