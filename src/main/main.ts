import { AppController } from "./core/controllers/AppController";
import { settingLog } from "./core/utils/logger";
import dotenv from "dotenv";

dotenv.config();
settingLog();
new AppController();
