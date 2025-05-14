import { AppController } from "./core/controllers/AppController";
import { PluginsManager } from "./core/plugins/PluginsManager";
import { settingLog } from "./core/utils/Logger";
import dotenv from "dotenv";

dotenv.config();
settingLog();

const pluginsManager = new PluginsManager();
await pluginsManager.init();

AppController.init();