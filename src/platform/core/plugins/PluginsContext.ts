import { IPluginContext } from "@/common/interface/IPluginContext";
import { IReader } from "@/common/interface/IReader";

import log from "electron-log/main";

export class PluginsContext implements IPluginContext {
    registryReader(reader: IReader): void {
        throw new Error("Method not implemented.");
    }
    checkWork(message: string): void {
        log.debug(message);
    }
    
}