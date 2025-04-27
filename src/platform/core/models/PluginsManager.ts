import { IPlugin } from "@/common/interface/IPlugin";
import path from "path";
import fs from "fs" 
import log from "electron-log/main"
import { IPluginContext } from "@/common/interface/IPluginContext";
import { IReader } from "@/common/interface/IReader";

export class PluginsManager implements IPluginContext {
    private plugins: IPlugin[] = [];
    

    /*
        /resources/arr.asar
        /plugins/ <-- user plugins
            /my_plugins/
                main.js <- entry point
            ...
            /our_plugins/
    */

    private async loadPlugins() {
        const pluginsDir = path.resolve(__dirname, "../../../plugins");
        if(!fs.existsSync(pluginsDir)) {
            fs.mkdir(pluginsDir, {recursive: true}, (err) => {
                log.error(`Cannot create folder ${err}`)
            });
        }
        const pluginsFolder = fs.readdirSync(pluginsDir, {withFileTypes: true})
            .filter(entry => entry.isDirectory())
            .map(entry => entry.name);
        for(const folder of pluginsFolder) {

            const entryFile = path.join(pluginsDir, folder, "main.js");
            if(!fs.existsSync(entryFile)) {
                log.warn(`Plugins folder ${folder} doesn't contain a main.js`);
            }

            try {
                const pluginModule = await require(entryFile);
                log.debug(`Before load plugin ${pluginModule}`);
                if(!pluginModule) {
                    log.error(`Error with load plugin ${pluginModule}`);
                } 
                const plugin: IPlugin = pluginModule.default;
                this.plugins.push(plugin);
            } catch (err) {
                log.error(`Error with load plugin ${folder}:`, err);
            }
        }
    }

    async init() {
        await this.loadPlugins();
        this.plugins.forEach(plugin => {
            plugin.activate(this);
        })
    }

    registryReader(reader: IReader): void {
        throw new Error("Method not implemented.");
    }

    checkWork(message: string): void {
        log.debug(`Message from plugin: ${message}`);
    }
}
