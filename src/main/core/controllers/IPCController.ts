import { IPCChannels } from "@/types/IPCChannels";
import { BrowserWindow, dialog, ipcMain } from "electron";
import { readFile } from "@/main/core/models/fileManager";

export class IPCController {
    constructor(private mainWindow: BrowserWindow){
        this.setupHandlers();
    }

    private setupHandlers() {
        this.setupFileDialog()
    }

    private setupFileDialog() {
        ipcMain.handle(
            IPCChannels.DIALOG_OPEN_FILE,
            async () => {
                const result = await dialog.showOpenDialog({
                    properties:["openFile"],
                    filters: [
                        {name: "PDF File", extensions: ["pdf"]}
                    ]
                });
                return readFile(result.filePaths[0]);
            }
        );
    };

}