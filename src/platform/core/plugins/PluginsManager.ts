import { IPlugin } from "@/common/interface/IPlugin";
import path from "path";
import fs from "fs" 
import log from "electron-log/main"
import { pathToFileURL } from "url";
import { PluginsContext } from "./PluginsContext";

export class PluginsManager {
    private plugins: IPlugin[] = [];
    private isDev: boolean = process.env.MODE === "development" ? true : false;
    
    /*
        /resources/arr.asar
        /plugins/ <-- user plugins
            /my_plugins/
                main.js <- entry point
                package.json <- manifest.
            ...
            /our_plugins/
    */

    private async loadPlugins() {
        let pathToPlugins = "./plugins";
        if(!this.isDev) {
            pathToPlugins = "../../../plugins";
        }

        const pluginsDir = path.resolve(__dirname, pathToPlugins);
        if(!fs.existsSync(pluginsDir)) {
            fs.mkdir(pluginsDir, {recursive: true}, () => {});
        }
        const pluginsFolder = fs.readdirSync(pluginsDir, {withFileTypes: true})
            .filter(entry => entry.isDirectory())
            .map(entry => entry.name);

        for(const folder of pluginsFolder) {
            const manifestUrl = pathToFileURL(path.resolve(pluginsDir, folder, "package.json"));
            if(!fs.existsSync(manifestUrl)) {
                log.warn(`Plugins folder ${folder} doesn't contain a main.js`);
            }
            const data = await fs.promises.readFile(manifestUrl, "utf-8");
            try {
                const packageJsonData = JSON.parse(data);
                const mainFile = pathToFileURL(path.resolve(pluginsDir, folder, packageJsonData.main)).href;
                const pluginModule = await import( /* webpackIgnore: true */ mainFile);
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
            plugin.activate(new PluginsContext());
        })
    }
}
