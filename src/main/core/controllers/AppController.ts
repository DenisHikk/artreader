import { app, BrowserWindow, webContents } from "electron";
import { platform } from "os";
import path from "path";
import logger from "../utils/Logger";
import { IPCController } from "./IPCController";

export class AppController {
    private mainWindow: BrowserWindow | null = null;
    private isDev: string | undefined = "dev";
    constructor() {
        this.setupAppLifeCycle();
    }

    private setupAppLifeCycle():void {
        app.whenReady().then(() => this.createWindow());
        app.on("window-all-closed", () => {
            if(process.platform !== "darwin") {
                app.quit();
            }
        })
        app.on("activate", () => {
            if(BrowserWindow.getAllWindows().length === 0) this.createWindow();
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

        console.log(this.isDev);
        if(this.isDev === "dev") {
            this.mainWindow.webContents.openDevTools();
        }

    }

    private loadAppliocation(): void {
        this.mainWindow?.loadFile("index.html");
    }

    private setupWindowListener() {
        if(!this.mainWindow) return;

        this.mainWindow?.on("close", () => {
            if(process.platform !== "darwin") {
                this.mainWindow?.close();
            }
        })
    }
}


