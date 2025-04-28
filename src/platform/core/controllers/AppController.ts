import { app, BrowserWindow, globalShortcut } from "electron";
import path from "path";
import log from "electron-log/main";
import { IPCController } from "./IPCController";
import { WindowBuilder } from "../window/WindowBuilder";
import { WindowManager } from "../window/WindowManager";

export class AppController {
    private windowManager = new WindowManager();
    private isDev: boolean = process.env.NODE_ENV === "development" ? true : false;

    constructor() {
        this.setupAppLifeCycle();
        log.debug(`proccess.env: ${process.env.MODE}`);
        log.initialize({ preload: true });
    }

    private setupAppLifeCycle(): void {
        app.whenReady().then(() => {
            this.createMainWindow()
            this.setupGlobalShortcut();
        });
        app.on("activate", () => {
            if (BrowserWindow.getAllWindows().length === 0) this.createMainWindow();
        })
        app.on("window-all-closed", () => {
            if (process.platform !== "darwin") {
                app.quit();
            }
        });
    }

    private createMainWindow(): void {
        const window = new WindowBuilder()
        .setSize(600, 800)
        .setMinize(500, 700)
        .setTitle("ArtReader")
        .setWebPreference({
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: true,
            webSecurity: true,
        })
        .build();
        this.windowManager.register(`reader${window.id}`, window);
        new IPCController(window, this.windowManager);
        window.loadFile("index.html");
    }

    private setupGlobalShortcut() {
        globalShortcut.register("Alt+CommandOrControl+I", () => {
            log.debug("Pressed 'Alt+CommandOrControl+I'")
            const focusedWindow = BrowserWindow.getFocusedWindow();
            if(!focusedWindow) {
                throw new Error("Cannot get focused window:/");
            }
            focusedWindow.webContents.openDevTools();
        })
    }
}
