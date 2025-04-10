import { IPCChannels } from "./IPCChannels"

declare global {
    interface Window {
        api: {
            dialogOpenFile: () => Promise<string>
        }
    }
}