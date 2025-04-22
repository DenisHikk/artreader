import { AppController } from "./core/controllers/AppController";
import { settingLog } from "./core/utils/Logger";
import dotenv from "dotenv";

dotenv.config();
settingLog();
new AppController();
