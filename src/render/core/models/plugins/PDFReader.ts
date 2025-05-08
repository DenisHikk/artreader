import { IReader } from "@/common/interface/IReader";

import log from "electron-log/renderer"
import { GlobalWorkerOptions, PDFDocumentProxy, PDFPageProxy, PDFWorker, PageViewport, TextLayer, Util, getDocument } from "pdfjs-dist";
import { TextContent } from "pdfjs-dist/types/src/display/api";
import { RenderMode } from "./RenderMode";


export class PDFReader implements IReader {
    private worker: PDFWorker | null = null;
    private pdfDoc: PDFDocumentProxy | null = null;
    private settings = {
        width: 595,
        height: 842,
        scale: 1.3
    }

    canHandle(file: string | File): boolean {
        let nameFile: string = file instanceof File ? file.name : file;
        const parts = nameFile.split(".");
        if(parts.length <= 1) throw new Error(`Unknow file name ${nameFile}`);
        log.debug(`PDFReader: file name is ${nameFile}`);
        return parts.pop()?.toLowerCase() === "pdf";
    }

    async load(file: string | File): Promise<void> {
        GlobalWorkerOptions.workerSrc = await window.api.workerDir();
        this.worker = new PDFWorker();
        const url = file instanceof File ? URL.createObjectURL(file) : file;
        const loadingTask = getDocument({
            url: url,
            worker: this.worker
        })
        try {
            this.pdfDoc = await loadingTask.promise
            log.debug("Load pdfDoc!");
        } catch (err) {
            log.error(`Something wrong with load PDF file, i don't know, maybe you know: ${err}`);
            throw err;
        }
    }

    async render(container: HTMLElement, numPage: number = 1): Promise<void> {
        const page = await this.pdfDoc?.getPage(numPage);
        if(!page) {
            throw new Error("Page not found");
        }

        const viewport = this.getViewport(page);
        const {canvas, ctx, textLayer} = this.prepareCanvasAndTextLayer(container, viewport);

        const renderPagePromise = this.renderPageToCanvas(page, ctx, viewport)

        const textContent = await page?.getTextContent();

        if(textContent) {
            this.renderTextLayerContent(textLayer, textContent, viewport);
        }
        await renderPagePromise;
    }

    destroy(): void {
        if(!this.worker || !this.pdfDoc) {
            return;
        }
        this.worker?.destroy();
        this.pdfDoc?.destroy();
        this.pdfDoc = null;
    }

    getTotalPages(): number {
        if(!this.pdfDoc) {
            throw new Error("Upload file first!")
        }
        return this.pdfDoc.numPages;
    }


    private getViewport(page: PDFPageProxy): PageViewport {
        const viewport = page?.getViewport({
            scale: this.settings.scale,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            dontFlip: false
        });
        if(!viewport) {
            throw new Error("Can't create viewport PDF");
        }
        return viewport;
    }

    private prepareCanvasAndTextLayer(container:HTMLElement, viewport: PageViewport) {
        const textLayer = container.getElementsByTagName("div")[0];
        const canvas = container.getElementsByTagName("canvas")[0];
        const ctx = canvas.getContext("2d");

        if(!ctx) {
            throw new Error("Can't create context, PDF");
        }
        canvas.width = viewport!.width;
        canvas.height = viewport!.height;

        textLayer.style.width = `${canvas.width}px`;
        textLayer.style.height = `${canvas.height}px`;

        container.style.width = `${canvas.width}px`;
        container.style.height = `${canvas.height}px`
        textLayer.style.setProperty("--total-scale-factor", viewport.scale.toString());
        return {canvas, ctx, textLayer}
    }

    private async renderPageToCanvas(page: PDFPageProxy, ctx: CanvasRenderingContext2D, viewport: PageViewport) {
        const renderTask = page?.render({canvasContext: ctx, viewport});
        renderTask?.promise;
    }

    private renderTextLayerContent(textLayer: HTMLDivElement, textContent: TextContent, viewport: PageViewport) {
        textLayer.innerHTML = "";
        textContent.items.forEach(item => {
            if ("str" in item) {
                if (item.str === " ") {
                    return;
                }
                const span = document.createElement("span");
                const [a, b, c, d, e, f] = item.transform;
                const [x, y] = viewport.convertToViewportPoint(e, f);
                span.setAttribute("dir", item.dir);
                span.style.fontFamily = `${textContent.styles[item.fontName]}, system-ui`;

                span.style.left = `${(x / viewport.width) * 100}%`
                span.style.top = `${(((y - d) / viewport.height) * 100)}%`
                span.style.transformOrigin = "left top";
                span.style.fontSize = `calc(var(--total-scale-factor) * ${a}px)`;
                span.innerText = item.str;
                textLayer.appendChild(span);
                const scaleX = item.width * viewport.scale / span.getBoundingClientRect().width;
                span.style.transform = `scaleX(${scaleX})`;
            }
        });
    }
}