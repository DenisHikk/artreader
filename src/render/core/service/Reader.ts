import { IReader } from "../../../common/interface/IReader";
import { PluginsManagerRender } from "../models/plugins/PluginsManagerRender";

import log from "electron-log/renderer";

export class Reader {
    private reader : IReader | undefined = undefined;
    private pluginsManager = PluginsManagerRender.getInstance();

    async load(file: string | File): Promise<void> {
        this.reader = this.pluginsManager.getReader().find(reader => reader.canHandle(file));
        if(!this.reader) {
            throw new Error("This format is not supported");
        }
        await this.reader.load(file);
    }

    async render(container: HTMLElement): Promise<void> {
        if(!this.reader) {
            throw new Error("You need to upload the file first!")
        }
        await this.reader.render(container);
    }
    nextPage(): void {
        throw new Error("Method not implemented.");
    }
    prevPage(): void {
        throw new Error("Method not implemented.");
    }
    goToPage(pageNumber: number): void {
        throw new Error("Method not implemented.");
    }
    getCurrentPage(): number {
        throw new Error("Method not implemented.");
    }
    destroy(): void {
        throw new Error("Method not implemented.");
    }
    
}