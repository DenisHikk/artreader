import { IPCChannels } from "@/types/IPCChannels";
import { BrowserWindow, dialog, ipcMain } from "electron";
import { readFile } from "@/main/core/models/fileManager";
import logger from "../utils/Logger";


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
                logger.info(`path file is ${result.filePaths}`)
                return result.filePaths[0];
            }
        );
    };

    private setupOpenFile() {
        ipcMain.handle(
            IPCChannels.OPEN_FILE,
            async (_, file: string): Promise<ArrayBuffer> => {
                logger.info(`file is ${file}`);
                return readFile(file);
            }
        )
    }

}