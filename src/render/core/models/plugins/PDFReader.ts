import { IReader } from "@/common/interface/IReader";



import log from "electron-log/renderer"
import { GlobalWorkerOptions, PDFDocumentProxy, PDFWorker, getDocument } from "pdfjs-dist";
import { h, ref } from "vue";

export class PDFReader implements IReader {
    private worker: PDFWorker | null = null;
    private pdfDoc: PDFDocumentProxy | null = null;
    private currentPage: number = 1;
    private settings = {
        canvas: {
            width: 595,
            height: 842,
            scale: 1.3
        }
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
            log.debug("Create pdfDoc!");
        } catch (err) {
            log.error(`Something wrong with laod PDF file: ${err}`);
            throw err;
        }
    }
    // TODO: Write render
    /*
    h(
        tag: string | Component,
        props?: object,
        children?: string | VNode | VNode[]
    )
  */
    async render(container: HTMLElement): Promise<void> {
        const page = await this.pdfDoc?.getPage(this.currentPage);
        const viewport = page?.getViewport({scale: this.settings.canvas.scale});

        const canvas = document.createElement("canvas");
        canvas.width = viewport!.width;
        canvas.height = viewport!.height;

        const ctx = canvas.getContext("2d");
        if(!ctx) {
            throw new Error("Can't create context");
        }
        if(!viewport) {
            throw new Error("Can't create viewport");
        }

        container.appendChild(canvas);

        
        const renderTask = page?.render({canvasContext: ctx, viewport});
        await renderTask?.promise;
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

}


// span {
//     position: absolute;
// }

// .text-layer {
//     position: absolute;
//     top: 0;
//     left: 0;
//     text-align: initial;
//     inset: 0;
//     overflow: clip;
//     opacity: 1;
//     line-height: 1;
//     text-size-adjust: none;
//     forced-color-adjust: none;
//     transform-origin: 0 0;
//     caret-color: CanvasText;
//     z-index: 20; //change to 0
// }