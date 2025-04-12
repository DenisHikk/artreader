import { app, BrowserWindow, webContents } from "electron";
import path from "path";
import log from "electron-log/main";
import util from "node:util"

import { IPCController } from "./IPCController";
import { settingLog } from "../utils/logger";

export class AppController {
    private mainWindow: BrowserWindow | null = null;
    private isDev: string | undefined = "dev";
    constructor() {
        this.setupAppLifeCycle();
        settingLog();
        log.initialize({ preload: true })
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
        log.debug("Hello from start debug");
        this.mainWindow.webContents.openDevTools();
        settingLog();
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


