import { app, BrowserWindow, dialog, ipcMain } from "electron"
import path from "path"

const WIDTH = 800;
const HEIGHT = 1200;

async function handleFileOpen() {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        title: "PDF files",
        filters: [{name: "PDF file", extensions: ["pdf"]}],
        properties: ["openFile"]
    });
    if(!canceled) return filePaths[0];
}

function createWindow() {
    const win = new BrowserWindow({
        width: WIDTH,
        height: HEIGHT,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js")
        }
    });
    win.webContents.openDevTools();
    win.loadFile(path.join(__dirname, "index.html"))
}

app.on("ready", () => {
    createWindow();
    ipcMain.handle("dialog:openFile", handleFileOpen);
});
