import { IPCChannels } from "@/types/IPCChannels";
import { BrowserWindow, dialog, ipcMain } from "electron";
import { readFile } from "@/main/core/models/fileManager";
import path from "path";
import log from "electron-log/main";
import { WindowManager } from "../window/WindowManager";
import { event } from "quasar";
import { WindowBuilder } from "../window/WindowBuilder";

export class IPCController {
    constructor(private mainWindow: BrowserWindow, private windowManager: WindowManager){
        this.setupHandlers();
    }

    private setupHandlers() {
        this.setupFileDialog();
        this.setupOpenFile();
        this.getSrcWorker();
        this.openReaderWindow();
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

    private openReaderWindow() {
        ipcMain.handle(
            IPCChannels.OPEN_READER_WINDOW,
            async(event, file) => {
                log.debug(`event: ${event.processId}, file`)
                const windowReader = new WindowBuilder()
                .setSize(980, 1200)
                .setTitle(file.split(".")[1])
                .setWebPreference({
                            preload: path.join(__dirname, "preload.js"),
                            contextIsolation: true,
                            nodeIntegration: true,
                            webSecurity: true,
                })
                .build();
                this.windowManager.register(`reader${windowReader.id}`, windowReader);
                windowReader.loadFile("reader.html");
            }
        )
    }
}