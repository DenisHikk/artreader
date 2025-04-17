import { getDocument, GlobalWorkerOptions, PageViewport, PDFDocumentProxy, PDFPageProxy, TextLayer } from "pdfjs-dist";
import log from "electron-log/renderer"
import { TextContent } from "pdfjs-dist/types/src/display/api";

export class PDFRenderService {
    private pdfDoc: PDFDocumentProxy | null = null; 
    private page: PDFPageProxy | null = null;
    constructor() {
    }

    public async readFile(pdfData: ArrayBuffer) {
        GlobalWorkerOptions.workerSrc = await window.api.workerDir();
        try {
            this.pdfDoc = await getDocument({
                data: pdfData,
            }).promise;
        } catch(err) {
            log.error(`Cannot read file: ${err}`)
        }
    }

    public async render(canvasContext: CanvasRenderingContext2D, viewport: PageViewport): Promise<void> {
        return this.page?.render({
            canvasContext: canvasContext,
            viewport: viewport,
            isEditing: true,
        }).promise;
    }

    public async getPage(pageNumber:number): Promise<PDFPageProxy | undefined> {
        if(!this.pdfDoc) {
            return;
        }
        this.page = await this.pdfDoc.getPage(pageNumber);
        return this.page;
    }

    public async getTextContet(): Promise<TextContent> {
        return this.page!.getTextContent();
    }

    public async getTextLayer(textContent: TextContent, viewport: PageViewport, container: HTMLElement ): Promise<TextLayer> {
        return new TextLayer({
            textContentSource: textContent,
            viewport: viewport,
            container: container
        });
    }

    public getViewport(scale: number, rotation: number = 0, dontFlip: boolean = false): PageViewport {
        const pixelRatio = window.devicePixelRatio || 1;
        return this.page!.getViewport({ scale: scale * pixelRatio, rotation, dontFlip });
    }

}