import {
    getDocument,
    GlobalWorkerOptions,
    TextLayer,
    type PDFDocumentProxy,
    type PDFPageProxy,
    type PageViewport,
} from "pdfjs-dist";
import type { TextContent } from "pdfjs-dist/types/src/display/api";
import log from "electron-log/renderer";


export class PDFRenderService {
    private pdfDoc: PDFDocumentProxy | null = null;
    private page: PDFPageProxy | null = null;

    constructor() { }

    public async readFile(pdfData: ArrayBuffer): Promise<void> {
        GlobalWorkerOptions.workerSrc = await window.api.workerDir();

        try {
            const loadingTask = getDocument({ data: pdfData });
            this.pdfDoc = await loadingTask.promise;
        } catch (err) {
            log.error(`Cannot read PDF file: ${err}`);
        }
    }

    public async getPage(pageNumber: number): Promise<PDFPageProxy | undefined> {
        if (!this.pdfDoc) {
            log.warn("PDF document is not loaded.");
            return;
        }

        try {
            this.page = await this.pdfDoc.getPage(pageNumber);
            return this.page;
        } catch (err) {
            log.error(`Cannot load page ${pageNumber}: ${err}`);
        }
    }

    public async render(
        canvasContext: CanvasRenderingContext2D,
        viewport: PageViewport
    ): Promise<void> {
        if (!this.page) {
            log.warn("No page selected to render.");
            return;
        }

        await this.page.render({
            canvasContext,
            viewport,
        }).promise;
    }

    public async getTextContent(): Promise<TextContent> {
        if (!this.page) {
            throw new Error("No page loaded to get text content from.");
        }
        return await this.page.getTextContent();
    }

    public async getTextLayer(
        textContent: TextContent,
        viewport: PageViewport,
        container: HTMLElement
    ): Promise<TextLayer> {
        const textLayer = new TextLayer({
            textContentSource: textContent,
            container,
            viewport,
        });

        await textLayer.render(); // рендерим слой сразу
        return textLayer;
    }

    public getViewport(
        scale: number,
        rotation: number = 0,
        dontFlip: boolean = false
    ): PageViewport {
        if (!this.page) {
            throw new Error("No page loaded to get viewport.");
        }

        const pixelRatio = window.devicePixelRatio || 1;
        return this.page.getViewport({
            scale: scale * pixelRatio,
            rotation,
            dontFlip,
        });
    }
}
