import { getDocument, GlobalWorkerOptions, PDFDocumentProxy, PDFPageProxy, PDFWorker } from "pdfjs-dist";
import log from "electron-log/renderer"

export class PDFRenderService {
    private pdfDoc: PDFDocumentProxy | null = null; 
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

    public async getPage(pageNumber:number): Promise<PDFPageProxy | undefined> {
        if(!this.pdfDoc) {
            return;
        }
        const page = await this.pdfDoc.getPage(pageNumber);
        return page;
    }

}