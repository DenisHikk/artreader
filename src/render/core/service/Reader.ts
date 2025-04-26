import { IReader } from "../../../common/interface/IReader";
import { ReaderPluginManager } from "../models/plugins/ReaderPluginsManager";

export class Reader {
    private reader : IReader | null = null;
    private readerPluginsManager: ReaderPluginManager;

    constructor() {
        this.readerPluginsManager = new ReaderPluginManager();
    }

    registerReaderPlugins(plguinReader: IReader) {
        this.readerPluginsManager.registerPlugin(plguinReader);
    }

    async load(file: string | File): Promise<void> {
        this.reader = this.readerPluginsManager.getPluginForFile(file);
    }
    render(container: HTMLElement): Promise<void> {
        throw new Error("Method not implemented.");
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