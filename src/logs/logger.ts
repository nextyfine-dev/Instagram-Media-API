// import path from "node:path";
// import winston from "winston";
// import { __dirname, __fileName } from "../config/index.js";

// const options = {
//   file: {
//     level: "info",
//     filename: path.resolve(__dirname(__fileName()), "app.log"),
//     handleExceptions: true,
//     maxsize: 5242880, // 5MB
//     maxFiles: 5,
//     format: winston.format.combine(
//       winston.format.timestamp(),
//       winston.format.json()
//     ),
//   },
//   console: {
//     level: "debug",
//     handleExceptions: true,
//     format: winston.format.combine(
//       winston.format.colorize(),
//       winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
//       winston.format.simple(),
//       winston.format.printf(
//         (info) =>
//           `[${process.pid}] [${info.timestamp}] ⚡️ ${info.level}: ${info.message}` +
//           (info.splat !== undefined ? `${info.splat}` : " ")
//       )
//     ),
//   },
// };

// const logger = winston.createLogger({
//   transports: [
//     new winston.transports.File(options.file),
//     new winston.transports.Console(options.console),
//   ],
//   exitOnError: false, // do not exit on handled exceptions
// });

// export class LoggerStream {
//   write(message: string) {
//     logger.info(message.substring(0, message.lastIndexOf("\n")));
//   }
// }

export default {};
