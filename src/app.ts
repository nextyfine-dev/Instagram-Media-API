import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import config from "./config/index.js";
import { nodeEnv } from "./config/constants.js";
// import { LoggerStream } from "./logs/logger.js";
import { sendSuccessRes } from "./services/serverService.js";
import axios from "axios";
import { load } from "cheerio";

const app = express();

app.use(cors());
app.use(helmet());
app.use(compression());

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "1mb" }));

if (config.NODE_ENV === nodeEnv.development) {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});

app.use(limiter);

app.use("/public", express.static("public"));

app.get("/", (req, res) => sendSuccessRes(res, "Welcome to API"));

app.get("/insta", async (req, res) => {
  try {
    const url = req.query.url as string;
    const { data } = await axios.get(url);

    const $ = load(data);

    const script = $('script[type="application/ld+json"]').html() || "";

    const jsonSc = JSON.parse(script);

    sendSuccessRes(res, "success", jsonSc);
  } catch (error) {
    sendSuccessRes(res, "error", null, 500);
  }
});

export default app;
