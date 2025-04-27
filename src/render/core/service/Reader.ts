import { IReader } from "../../../common/interface/IReader";

export class Reader {
    private reader : IReader | null = null;

    constructor() {
    }

    registerReaderPlugins(plguinReader: IReader) {
        
    }

    async load(file: string | File): Promise<void> {

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