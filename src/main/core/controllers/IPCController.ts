import { IPCChannels } from "@/types/IPCChannels";
import { BrowserWindow, dialog, ipcMain } from "electron";
import { readFile } from "@/main/core/models/fileManager";
import logger from "pino"

export class IPCController {
    constructor(private mainWindow: BrowserWindow){
        this.setupHandlers();
    }

    private setupHandlers() {
        this.setupFileDialog();
        this.setupOpenFile();
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
                logger
                return result.filePaths[0];
            }
        );
    };

    private setupOpenFile() {
        ipcMain.handle(
            IPCChannels.OPEN_FILE,
            async (_, file:string): Promise<ArrayBuffer | SharedArrayBuffer> => {
                return readFile(file);
            }
        )
    }

}