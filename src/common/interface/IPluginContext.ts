import { IReader } from "@/common/interface/IReader";

// There's we add handlers for registry command, reader and etc.
// Rewrite to namespace
// Parametrs public
export interface IPluginContext {
    registryReader(reader: IReader): void;
    checkWork(message: string): void;
}