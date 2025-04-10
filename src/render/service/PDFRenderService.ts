import { getDocument, PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist"

export class PDFRenderService {
    private pdfDoc: PDFDocumentProxy | null = null; 
    constructor(private pdfData: ArrayBuffer) {
        this.readFile();
    }

    private async readFile() {
        this.pdfDoc = await getDocument(this.pdfData).promise;
    }

    public async renderPage(pageNumber:number): Promise<PDFPageProxy | undefined> {
        const page = await this.pdfDoc?.getPage(pageNumber);
        return page;
    }

}