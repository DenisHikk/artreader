import { IReader } from "@/common/interface/IReader";

import log from "electron-log/renderer"
import { GlobalWorkerOptions, PDFDocumentProxy, PDFWorker, TextLayer, Util, getDocument } from "pdfjs-dist";
import { TextContent } from "pdfjs-dist/types/src/display/api";


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

    /*
        .reader_container -> .page_container -> canvas && .text_layer 
    */
   //scale, rotation, offsetX, offsetY, dontFlip,
    async render(container: HTMLElement, numPage: number): Promise<void> {
        const page = await this.pdfDoc?.getPage(numPage);
        const viewport = page?.getViewport({
            scale: this.settings.scale,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            dontFlip: false
        });

        const textLayer = container.getElementsByTagName("div")[0];
        const canvas = container.getElementsByTagName("canvas")[0];
        const ctx = canvas.getContext("2d");
        if(!viewport) {
            throw new Error("Can't create viewport");
        }
        if(!ctx) {
            throw new Error("Can't create context");
        }
        canvas.width = viewport!.width;
        canvas.height = viewport!.height;

        textLayer.style.width = `${canvas.width}px`;
        textLayer.style.height = `${canvas.height}px`;

        container.style.width = `${canvas.width}px`;
        container.style.height = `${canvas.height}px`

        const renderTask = page?.render({canvasContext: ctx, viewport});
        await renderTask?.promise;

        const textContent = await page?.getTextContent();
        
        // const textLayerBlock = new TextLayer({
        //     textContentSource: textContent as TextContent,
        //     container: textLayer,
        //     viewport: viewport
        // });

        textLayer.style.setProperty("--total-scale-factor", viewport.scale.toString());
        // await textLayerBlock.render();

        // example how it work
        // left: 26.49%;
        // top: 5.21%;
        // font-size: calc(var(--total-scale-factor)* 14.04px);
        // font-family: sans-serif;
        // transform: scaleX(0.903903);

        // matrix
        //fontSize: 14.04
        //?0
        //?0
        //fontSize: 14.04
        //x: 42.6
        //y: 207.05

        if(textContent) {
            textLayer.innerHTML = "";
            textContent.items.forEach(item => {
                if("str" in item ) {
                    if(item.str === " ") {
                        return;
                    }
                    const span = document.createElement("span");
                    const [a,b,c,d,e,f] = item.transform;
                    const [x,y] = viewport.convertToViewportPoint(e,f);
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
            })
        }


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
}