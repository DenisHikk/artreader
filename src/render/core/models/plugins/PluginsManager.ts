import { IPlugin } from "@/common/interface/IPlugin";
import { IPluginContext } from "@/common/interface/IPluginContext";
import { IReader } from "@/common/interface/IReader";
import log from "electron-log/renderer"

export class PluginsManager implements IPluginContext {
    private static INSTANCE: PluginsManager; 
    
    private plugins: IPlugin[] = [];
    private reader: IReader[] = [];
    
    private constructor() {}

    public async init() {
        this.plugins = await window.plugins.getPlugins();
        this.registryPlugins();
    }

    public static getInstance(): PluginsManager {
        if(!PluginsManager.INSTANCE) {
            PluginsManager.INSTANCE = new PluginsManager();
        }
        return PluginsManager.INSTANCE;
    }

    private registryPlugins() {

    }

    public getReader(): IReader[] {
        return this.reader;
    }

    registryReader(reader: IReader): void {
        this.reader.push(reader);
    }
    checkWork(message: string): void {
        log.debug(message);
    }
}