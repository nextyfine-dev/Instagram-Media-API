import app from "./app.js";
import { runOnThread } from "./services/serverService.js";
runOnThread(app);
