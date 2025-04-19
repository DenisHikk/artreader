import { BrowserWindow, WebPreferences } from "electron";
import { BrowserWindowConstructorOptions } from "electron/main";

export class WindowBuilder {
    private options: BrowserWindowConstructorOptions = {
        webPreferences: {
            devTools: true // its enable devTools not turn on | read documentation
        }
    }
    constructor() {}

    setSize(width: number, height: number): this {
        this.options.width = width;
        this.options.height = height;
        return this;
    }

    setTitle(title: string): this {
        this.options.title = title;
        return this;
    }

    asChildOf(parentWindow: BrowserWindow): this {
        this.options.parent = parentWindow;
        return this;
    }

    setWebPreference(webPreferences: WebPreferences): this {
        this.options.webPreferences = {
            ...this.options.webPreferences,
            ...webPreferences
        };
        return this;
    }

    withOptions(options: BrowserWindowConstructorOptions): this {
        this.options = { // read spread operaion)
            ...this.options,
            ...options,
            webPreferences: {
                ...this.options.webPreferences,
                ...options.webPreferences
            }
        }
        return this;
    }

    build(): BrowserWindow {
        return new BrowserWindow(this.options);
    }
}