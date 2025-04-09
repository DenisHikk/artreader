import { contextBridge, ipcRenderer } from "electron";
import IPCChannels from "@/types/IPCChannels";

contextBridge.exposeInMainWorld("api", {
    dialogOpenFile: () => ipcRenderer.invoke(IPCChannels.DIALOG_OPEN_FILE)
})