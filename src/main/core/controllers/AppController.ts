import { app, BrowserWindow, webContents } from "electron";
import path from "path";
import log from "electron-log/main";
import { IPCController } from "./IPCController";

export class AppController {
    private mainWindow: BrowserWindow | null = null;
    private isDev: boolean = process.env.NODE_ENV === "development" ? true : false;
    constructor() {
        this.setupAppLifeCycle();
        log.info(`proccess.env: ${process.env.MODE}`);
    }

    private setupAppLifeCycle(): void {
        app.whenReady().then(() => this.createWindow());
        app.on("window-all-closed", () => {
            if (process.platform !== "darwin") {
                app.quit();
            }
        })
        app.on("activate", () => {
            if (BrowserWindow.getAllWindows().length === 0) this.createWindow();
        })
    }

    private createWindow(): void {
        //rewrite from .env to json setting like that, maybe kind of its will best practice i don't know:D
        const WIDTH: number = 980;
        const HEIGHT: number = 1280;
        this.mainWindow = new BrowserWindow({
            width: WIDTH,
            height: HEIGHT,
            webPreferences: {
                contextIsolation: true,
                preload: path.resolve(__dirname, "preload.js")
            }
        });
        this.loadAppliocation();
        this.setupWindowListener();
        new IPCController(this.mainWindow);
        this.mainWindow.webContents.openDevTools();
    }

    private loadAppliocation(): void {
        log.info("Application started")
        this.mainWindow?.loadFile("index.html");
    }

    private setupWindowListener() {
        if (!this.mainWindow) return;

        this.mainWindow?.on("close", () => {
            if (process.platform !== "darwin") {
                this.mainWindow?.close();
            }
        })
    }
}


