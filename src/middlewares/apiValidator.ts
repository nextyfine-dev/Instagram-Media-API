import { RequestValidator } from "fastest-express-validator";

export const getInstaPostValidator = RequestValidator({
  body: {
    url: { type: "string", min: 11 },
  },
});

export const instaUserNameValidator = RequestValidator({
  body: {
    userName: { type: "string", min: 2 },
  },
});
