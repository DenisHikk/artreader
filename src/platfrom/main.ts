import { AppController } from "./core/controllers/AppController";
import { PluginsManager } from "./core/models/PluginsManager";
import { settingLog } from "./core/utils/Logger";
import dotenv from "dotenv";

dotenv.config();
settingLog();

const pluginsManager = new PluginsManager();
pluginsManager.loadPlugins().then( () => {
    pluginsManager.sendPluginsRender();
}); 

new AppController();
