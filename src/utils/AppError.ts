import { Err } from "../interfaces";

class AppError implements Err {
  message: string;
  statusCode: number;
  status: string;
  isOperational: boolean;
  errName?: string;
  code?: string | number;
  name: string;

  constructor(
    message: string,
    statusCode: number,
    name?: string,
    code?: string | number
  ) {
    // super(message);

    this.message = message;
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    this.name = name || "App Error";
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
