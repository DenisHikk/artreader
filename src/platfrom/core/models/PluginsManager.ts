import { IPlugin } from "@/common/interface/IPlugin";
import path from "path";
import fs from "fs" 
import log from "electron-log/main"
import { ipcMain } from "electron";
import { IPCChannels } from "@/types/IPCChannels";
import { IPluginContext } from "@/common/interface/IPluginContext";
import { IReader } from "@/common/interface/IReader";

export class PluginsManager implements IPluginContext {
    private plugins: IPlugin[] = [];
    
    //TODO: need rewrite
    async loadPlugins() {
        const pluginsDir = path.join(__dirname, "../plugins");
        const pluginsFiles = fs.readdirSync(pluginsDir).filter(file => file.endsWith(".js"));
        for(const file in pluginsFiles) {
            try {
                const pluginPath = path.join(pluginsDir, file);
                const pluginModule = await import(pluginPath);
                const plugin: IPlugin = pluginModule.default;
                this.plugins.push(plugin);
            } catch (err) {
                log.error(`Error with load plugin ${file}:`, err);
            }
        }
    }

    sendPluginsRender() {
        ipcMain.handle(IPCChannels.GET_PLUGINS, () => this.plugins);
    }

    registryReader(reader: IReader): void {
        throw new Error("Method not implemented.");
    }
}
