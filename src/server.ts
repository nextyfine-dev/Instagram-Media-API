import app from "./app.js";
import config from "./config/index.js";
// import logger from "./logs/logger.js";
// import { runOnThread } from "./services/serverService.js";

const port = config.PORT;

app.listen(port, () =>
  //   logger.info(``)
  console.log(`Server is running at http://127.0.0.1:${port}`)
);

// runOnThread(app);
