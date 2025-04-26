import { IReader } from "@/common/interface/IReader";

// There's we add handlers for registry command, reader and etc.
export interface IPluginContext {
    registryReader(reader: IReader): void;
}