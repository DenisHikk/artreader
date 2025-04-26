import { IReader } from "../../../../common/interface/IReader";

export class PDFReader implements IReader {
    canHandle(file: string | File): boolean {
        throw new Error("Method not implemented.");
    }
    load(file: string | File): Promise<void> {
        throw new Error("Method not implemented.");
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