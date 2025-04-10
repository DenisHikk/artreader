import { promises } from "node:fs";

export async function readFile(path: string) {
    const data = await promises.readFile(path);
    return data.buffer;
}