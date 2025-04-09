import { IPCChannels } from "@/types/IPCChannels";
import { BrowserView } from "electron";

export class IPCController {
    constructor(private mainWindow: BrowserView){
        setupHandlers();
    }

    private setupHandlers() {

    }

    private setupFileDialog() {
        
    }

}