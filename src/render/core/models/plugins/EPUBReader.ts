import Epub, { Book, Rendition } from "epubjs";
import { IReader } from "../../../../common/interface/IReader";
import log from "electron-log/renderer"


export class EPUBReader implements IReader {
    private book:Book | null = null;
    private renderTask: Rendition | null = null;

    canHandle(file: string | File): boolean {
        throw new Error("Method not implemented.");
    }

    async load(file: string | File): Promise<void> {
        const url = file instanceof File ? URL.createObjectURL(file) : file;
        this.book = Epub(url);
    }

    async render(container: HTMLElement): Promise<void> {
        if(!this.book) {
            throw new Error("Can't load EPUB book");
        }
        this.renderTask = this.book?.renderTo(container as Element, {
            flow: "pagination", 
            width: "100%",
            height: "100%",
            allowScriptedContent: true
        });

        await this.renderTask?.display();
        this.renderTask.on("relocated", (location:any) => {
            const currentCFI = location.start.cfi;
            log.debug(`Current position: ${currentCFI}`);
            // const currentPage = this.book?.locations.locationFromCfi(currentCFI);
        })
    }

    async nextPage(): Promise<void> {
        await this.renderTask?.next();
        await this.renderTask?.display();
    }

    async prevPage(): Promise<void> {
        await this.renderTask?.prev();
        await this.renderTask?.display();
    }

    destroy(): void {
        this.book?.destroy();
        this.book = null;
    }
}