import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

export const __fileName = (url = import.meta.url) => fileURLToPath(url);

export const __dirname = (fileName = __fileName()) => dirname(fileName);

const envPath = path.resolve(__dirname(), ".env");

dotenv.config({ path: envPath });

export default {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  APP_ID: process.env.APP_ID,
  APP_SECRET: process.env.APP_SECRET,
};
