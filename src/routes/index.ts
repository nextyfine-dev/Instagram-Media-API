import express from "express";
import { getInstagramPost } from "../controllers/instagramController.js";
import { getInstaPostValidator } from "../middlewares/apiValidator.js";

const router = express.Router();

router.post("/posts", getInstaPostValidator, getInstagramPost);

export default router;
