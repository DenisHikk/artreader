import { IPluginContext } from "./IPluginContext";

export interface IPlugin {
    name: string;
    version: string,
    description: string,
    activate(pluginContext: IPluginContext): void;
    deactivate(pluginContext: IPluginContext): void;
}