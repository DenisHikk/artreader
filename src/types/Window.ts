import { IPCChannels } from "./IPCChannels"
//register in preloader 
declare global {
    interface Window {
        api: {
            dialogOpenFile: () => Promise<string>,
            openFile: (path: string)=>Promise<ArrayBuffer>,
            workerDir: () => Promise<string>
        },
    }
}
