import { promises } from "node:fs";


//rewrite to stream for big files
export async function readFile(path: string): Promise<ArrayBuffer> {
    const data = await promises.readFile(path);
    return data.buffer.slice(data.buffer.byteLength, data.buffer.byteLength + data.buffer.maxByteLength) as ArrayBuffer;
}