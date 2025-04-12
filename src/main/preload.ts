import { contextBridge, ipcRenderer } from "electron";
import {IPCChannels} from "@/types/IPCChannels";

contextBridge.exposeInMainWorld("api", {
    dialogOpenFile: (): Promise<string> => ipcRenderer.invoke(IPCChannels.DIALOG_OPEN_FILE),
    openFile: (file: string): Promise<ArrayBuffer> => ipcRenderer.invoke(IPCChannels.OPEN_FILE, file),
    workerDir: (): Promise<string> => ipcRenderer.invoke(IPCChannels.WORKER_DIR)
})