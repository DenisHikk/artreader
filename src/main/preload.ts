import { contextBridge, ipcRenderer } from "electron";
import {IPCChannels} from "@/types/IPCChannels";

contextBridge.exposeInMainWorld("api", {
    dialogOpenFile: (): Promise<string> => ipcRenderer.invoke(IPCChannels.DIALOG_OPEN_FILE),
    openFile: (path: string): Promise<ArrayBuffer> => ipcRenderer.invoke(IPCChannels.OPEN_FILE)
})