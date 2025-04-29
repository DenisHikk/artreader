import { contextBridge, ipcRenderer } from "electron";
import {IPCChannels} from "@/types/IPCChannels";


contextBridge.exposeInMainWorld("api", {
    dialogOpenFile: (): Promise<string> => ipcRenderer.invoke(IPCChannels.DIALOG_OPEN_FILE),
    openFile: (file: string): Promise<ArrayBuffer> => ipcRenderer.invoke(IPCChannels.OPEN_FILE, file),
    workerDir: (): Promise<string> => ipcRenderer.invoke(IPCChannels.WORKER_DIR),
    openReaderWindow: (file: string) => ipcRenderer.invoke(IPCChannels.OPEN_READER_WINDOW, file),
    getFilePath: (): Promise<string> => new Promise((resolve) => {
        ipcRenderer.once(IPCChannels.GET_FILE_PATH, (_, filePath: string) => {
            resolve(filePath);
        })
    })
})
