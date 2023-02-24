import { RequestValidator } from "fastest-express-validator";

export const getInstaPostValidator = RequestValidator({
  body: {
    url: { type: "string", min: 11 },
  },
});
