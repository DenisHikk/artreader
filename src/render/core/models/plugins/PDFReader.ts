import { IReader } from "@/common/interface/IReader";

import log from "electron-log/renderer"
import { GlobalWorkerOptions, PDFDocumentProxy, PDFPageProxy, PDFWorker, PageViewport, RenderTask, TextLayer, Util, getDocument } from "pdfjs-dist";
import { TextContent } from "pdfjs-dist/types/src/display/api";

export class PDFReader implements IReader {
    private worker: PDFWorker | null = null;
    private pdfDoc: PDFDocumentProxy | null = null;
    private renderTasks: Map<number, RenderTask> = new Map();
    private objectURL: string | null = null;
    private settings = {
        width: 595,
        height: 842,
        scale: 1.0
    }

    canHandle(file: string | File): boolean {
        let nameFile: string = file instanceof File ? file.name : file;
        const parts = nameFile.split(".");
        if(parts.length <= 1) throw new Error(`Unknow file name ${nameFile}`);
        log.debug(`PDFReader: file name is ${nameFile}`);
        return parts.pop()?.toLowerCase() === "pdf";
    }

    async load(file: string | File): Promise<void> {
        if(this.objectURL) this.destroy();
        GlobalWorkerOptions.workerSrc = await window.api.workerDir();
        this.worker = new PDFWorker();
        this.objectURL = file instanceof File ? URL.createObjectURL(file) : file;
        const loadingTask = getDocument({
            url: this.objectURL,
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
        if(!page) throw new Error("Page not found");

        const viewport = this.getViewport(page);
        const {canvas, ctx, textLayer} = this.prepareCanvasAndTextLayer(container, viewport);

        const prevTask = this.renderTasks.get(numPage);
        if(prevTask) {
            try {
                prevTask.cancel(0);
            } catch(err) {
                log.error("Something wrong with cancel prevTask");
            } finally {
                this.renderTasks.delete(numPage);
            }
        }

        const renderTask = page?.render({canvasContext: ctx, viewport});        
        this.renderTasks.set(numPage, renderTask);

        try {
            await renderTask.promise;
        } catch (err:any) {
            if(err.name !== "RenderingCancelledException") throw err;
        } finally {
            this.renderTasks.delete(numPage);
        }

        const textContent = await page?.getTextContent();

        if(textContent) {
            this.renderTextLayerContent(textLayer, textContent, viewport);
        }
    }

    async destroy(): Promise<void> {
        this.cancelAllRender();
        if(this.pdfDoc) {
            await this.pdfDoc.destroy();
            this.pdfDoc = null;
        }
        if(this.worker) {
            this.worker.destroy();
            this.worker = null;
        }
        if(this.objectURL) {
            URL.revokeObjectURL(this.objectURL);
            this.objectURL = null;
        }
    }

    async getPage(numPage: number): Promise<PDFPageProxy> {
        if (!this.pdfDoc) {
            throw new Error("PDF not loaded");
        }
        return this.pdfDoc.getPage(numPage);
    }

    getTotalPages(): number {
        if(!this.pdfDoc) {
            log.debug(`PDF is ${this.pdfDoc}`)
            throw new Error("Upload file first!")
        }
        return this.pdfDoc.numPages;
    }

    getViewport(page: PDFPageProxy): PageViewport {
        const viewport = page?.getViewport({
            scale: this.settings.scale,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            dontFlip: false
        });
        if(!viewport) throw new Error("Can't create viewport PDF");
        return viewport;
    }

    setScale(scale:number) {
        this.settings.scale = scale;
    }

    cancelAllRender() {
        this.renderTasks.forEach(renderTask => {
            try {
                renderTask.cancel();
            } catch(err) {
                log.error(err);
            }
        });
        this.renderTasks.clear();
    }

    async resizeContainersPdf(containersPdf: NodeListOf<Element>) {
        const page = await this.pdfDoc?.getPage(1);
        if(!page) throw new Error("Page not found");

        const viewport = this.getViewport(page);
        containersPdf.forEach(elem => {
            const htmlelem = elem as HTMLElement;

            if(!viewport) return;
            if(!htmlelem) return;

            htmlelem.style.width = `${viewport.width}px`;
            htmlelem.style.height = `${viewport.height}px`;
        })
    }

    private prepareCanvasAndTextLayer(container:HTMLElement, viewport: PageViewport) {
        const canvas = container.querySelector("canvas") as HTMLCanvasElement;
        const textLayer = container.querySelector(".text_layer") as HTMLDivElement;
        
        if(!textLayer) throw new Error("Can't find textLayer, PDF");;
        if(!canvas) throw new Error("Can't find canvas, PDF");;

        const ctx = canvas.getContext("2d");

        if(!ctx) {
            throw new Error("Can't create context, PDF");
        }
        canvas.width = viewport!.width;
        canvas.height = viewport!.height;

        textLayer.style.width = `${canvas.width}px`;
        textLayer.style.height = `${canvas.height}px`;
        textLayer.classList.add("text_layer");

        container.style.width = `${canvas.width}px`;
        container.style.height = `${canvas.height}px`        
        container.appendChild(canvas);
        container.appendChild(textLayer);

        return {canvas, ctx, textLayer}
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