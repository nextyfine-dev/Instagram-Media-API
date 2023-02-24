import cluster from "node:cluster";
import { Response, Express } from "express";
import { StatusCodes } from "http-status-codes";
import config from "../config/index.js";
import { cpuLength } from "../config/constants.js";
import logger from "../logs/logger.js";

export const sendSuccessRes = (
  res: Response,
  message: String,
  data?: undefined | any,
  statusCode: StatusCodes = StatusCodes.OK
) =>
  res.status(statusCode).json({
    status: "success",
    statusCode,
    message,
    data,
  });

export const runOnThread = (app: Express) => {
  const port = config.PORT || 8080;
  if (cluster.isPrimary) {
    for (let i = 0; i < cpuLength; i++) {
      cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
      logger.warn(`worker ${worker.process.pid} died`);
      cluster.fork();
    });
  } else {
    app.listen(port, () => {
      logger.info(`server ${process.pid} @ http://127.0.0.1:${port}`);
    });
  }
};
