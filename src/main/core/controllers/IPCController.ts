import { IPCChannels } from "@/types/IPCChannels";
import { BrowserWindow, dialog, ipcMain } from "electron";
import { readFile } from "@/main/core/models/fileManager";
import path from "path";
import log from "electron-log/main"



export class IPCController {
    constructor(private mainWindow: BrowserWindow){
        this.setupHandlers();
    }

    private setupHandlers() {
        this.setupFileDialog();
        this.setupOpenFile();
        this.getSrcWorker();
    }

    private setupFileDialog() {
        ipcMain.handle(
            IPCChannels.DIALOG_OPEN_FILE,
            async ():Promise<string> => {
                const result = await dialog.showOpenDialog({
                    properties:["openFile"],
                    filters: [
                        {name: "Book file", extensions: ["pdf"]}
                    ]
                });
                return result.filePaths[0];
            }
        );
    };

    private setupOpenFile() {
        ipcMain.handle(
            IPCChannels.OPEN_FILE,
            async (_, file: string): Promise<ArrayBuffer> => {
                return readFile(file);
            }
        )
    }

    private getSrcWorker() {
        ipcMain.handle(
            IPCChannels.WORKER_DIR,
            async (): Promise<string> => {
                return path.join(__dirname, "../node_modules/pdfjs-dist/build/pdf.worker.min.mjs");
            }
        )
    }

}