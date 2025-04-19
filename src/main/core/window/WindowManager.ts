import { BrowserWindow } from "electron";

export class WindowManager {
    private windowsMap: Map<string, BrowserWindow> = new Map();
    constructor(){}

    register(key: string, window: BrowserWindow): void {
        if(this.windowsMap.has(key)) {
            throw new Error(`Window with name ${key} is already registered`);
        }
        this.windowsMap.set(key, window);
        this.attachLifecycle(key, window);
    }

    private attachLifecycle(key: string, window: BrowserWindow) {
        window.on("close", () => { 
            this.windowsMap.delete(key);
        });
    }

    getWindow(name: string): BrowserWindow | null {
        const window = this.windowsMap.get(name);
        return window && !window.isDestroyed() ? window : null;
    }

    close(key: string): void {
        const window = this.windowsMap.get(key);
        if (window && !window.isDestroyed()) {
            window.close();
        }
    }

    closeAll(): void {
        for (const window of this.windowsMap.values()) {
            if (!window.isDestroyed()) {
                window.close();
            }
        }
        this.windowsMap.clear();
    }

    has(key: string): boolean {
        const win = this.windowsMap.get(key);
        return !!win && !win.isDestroyed();
    }
    
}