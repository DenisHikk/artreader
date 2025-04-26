import { IPluginContext } from "./IPluginContext";

export interface IPlugin {
    name: string;
    version: string,
    description: string,
    activateMain(pluginContext: IPluginContext): void;
    activateRenderer(pluginContext: IPluginContext): void;
}