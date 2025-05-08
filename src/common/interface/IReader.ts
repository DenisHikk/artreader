import { RenderMode } from "@/render/core/models/plugins/RenderMode";

export interface IReader {
    canHandle(file: string | File): boolean;
    load(file: string | File): Promise<void>;
    render(container: HTMLElement, numPage?: number, mode?: RenderMode): Promise<void>;
    nextPage(): void;
    prevPage(): void;
    goToPage(pageNumber: number): void;
    getCurrentPage(): number;
    destroy(): void;
    getTotalPages(): number;
}