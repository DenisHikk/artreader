import { IPluginContext } from "./IPluginContext";

export interface IPlugin {
    activate(pluginContext: IPluginContext): void;
    deactivate(pluginContext: IPluginContext): void;
}