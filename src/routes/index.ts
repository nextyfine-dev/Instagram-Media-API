import express from "express";
import {
  getInstaDataByUSerName,
  getInstagramPost,
} from "../controllers/instagramController.js";
import {
  getInstaPostValidator,
  instaUserNameValidator,
} from "../middlewares/apiValidator.js";

const router = express.Router();

router.post("/posts", getInstaPostValidator, getInstagramPost);
router.post("/user", instaUserNameValidator, getInstaDataByUSerName);

export default router;
