import { getDocument, GlobalWorkerOptions, PDFDocumentProxy, PDFPageProxy, PDFWorker } from "pdfjs-dist";
import logger from "../utils/Logger";

export class PDFRenderService {
    private pdfDoc: PDFDocumentProxy | null = null; 
    constructor() {
    }

    public async readFile(pdfData: ArrayBuffer) {
        logger.info(`size pdfData ${pdfData.byteLength}`);
        GlobalWorkerOptions.workerSrc = await window.api.workerDir();
        try {
            this.pdfDoc = await getDocument({
                data: pdfData,
            }).promise;
            logger.info(`pdfDoc inner readFile is: ${this.pdfDoc}`)
        } catch(err) {
            logger.error(err);
        }
    }

    public async getPage(pageNumber:number): Promise<PDFPageProxy | undefined> {
        if(!this.pdfDoc) {
            logger.error(`pdfDoc is ${this.pdfDoc}`);
            return;
        }
        const page = await this.pdfDoc.getPage(pageNumber);
        logger.info(`inside getPage page: ${page}`);
        return page;
    }

}