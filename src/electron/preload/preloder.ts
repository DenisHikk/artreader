import { contextBridge, ipcRenderer } from "electron";
//не забудь добавить в в global.d.ts

contextBridge.exposeInMainWorld("api", {
    handleFileOpen: () => ipcRenderer.invoke("dialog:openFile")
});