import { AppController } from "./core/controllers/AppController";
import log from "electron-log"
import util from "node:util"
import { settingLog } from "./core/utils/logger";
import dotenv from "dotenv";

dotenv.config();
settingLog();
new AppController();
