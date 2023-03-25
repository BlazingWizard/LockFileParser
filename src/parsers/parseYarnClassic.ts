import { readFileByLine } from "../helpers/readFile";
import { type FileHandle } from "node:fs/promises";

export async function parseYarnClassic(fileHandle: FileHandle) {
	for await (const line of readFileByLine(fileHandle)) {
		console.log(line);
	}
}
