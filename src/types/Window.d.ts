import { IPlugin } from "@/common/interface/IPlugin"

declare global {
    interface Window {
        api: {
            dialogOpenFile: (file: string) => Promise<string>,
            openFile: (path: string)=>Promise<ArrayBuffer>,
            workerDir: () => Promise<string>
            openReaderWindow(file: string):void
            getFilePath(): Promise<string>
        }
        plugins: {
            getPlugins: () => Promise<IPlugin[]>
        }
    }
}
export {};