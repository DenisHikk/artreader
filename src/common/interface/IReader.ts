import { RenderMode } from "@/render/core/models/plugins/RenderMode";

export interface IReader {
    canHandle(file: string | File): boolean;
    load(file: string | File): Promise<void>;
    render(container: HTMLElement, renderMode?: RenderMode, numPage?: number): Promise<void>;
    destroy(): void;
    getTotalPages(): number;
}