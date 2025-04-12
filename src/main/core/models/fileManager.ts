import { promises } from "node:fs";
import log from "electron-log/main"


//rewrite to stream for big files
export async function readFile(path: string): Promise<ArrayBuffer> {
    const data = await promises.readFile(path);
    log.info("helo");
    return data.buffer.slice(0, data.buffer.byteLength + data.buffer.maxByteLength) as ArrayBuffer;
}