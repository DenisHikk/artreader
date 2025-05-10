import { IReader } from "../../../../common/interface/IReader";

export class EPUBReader implements IReader {
    getTotalPages(): number {
        throw new Error("Method not implemented.");
    }
    canHandle(file: string | File): boolean {
        throw new Error("Method not implemented.");
    }
    load(file: string | File): Promise<void> {
        throw new Error("Method not implemented.");
    }
    render(container: HTMLElement): Promise<void> {
        throw new Error("Method not implemented.");
    }
    destroy(): void {
        throw new Error("Method not implemented.");
    }
    
}