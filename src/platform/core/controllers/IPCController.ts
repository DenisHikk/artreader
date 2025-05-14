import { IPCChannels } from "@/types/IPCChannels";
import { BrowserWindow, dialog, ipcMain } from "electron";
import { readFile } from "@/platform/core/models/fileManager";
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
                        {name: "Book file", extensions: ["pdf", "epub"]}
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
                try {
                    return readFile(file);
                } catch(err) {
                    log.error(`Error while reading file: ${err}`);
                    throw new Error("Error");
                }
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
            async(event, file: string) => {
                log.debug(`file ${file}`)
                const windowReader = new WindowBuilder()
                .setSize(980, 1200)
                .setTitle(file.split(".")[1])
                .setWebPreference({
                            preload: path.join(__dirname, "mainPreload.js"),
                            contextIsolation: true,
                            nodeIntegration: false,
                            webSecurity: true,
                })
                .build();
                this.windowManager.register(`reader${windowReader.id}`, windowReader);
                windowReader.loadFile("index.html");
                windowReader.webContents.once("did-finish-load", () => {
                    windowReader.webContents.send(IPCChannels.GET_FILE_PATH, file)
                })
            }
        )
    }
}