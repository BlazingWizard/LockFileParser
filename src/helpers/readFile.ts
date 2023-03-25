import { createInterface } from "node:readline";
import { type FileHandle } from "node:fs/promises";

// https://nodejs.org/api/readline.html#example-read-file-stream-line-by-line
export async function* readFileByLine(fileHandle: FileHandle) {
	const readStream = fileHandle.createReadStream();
	const lineReader = createInterface({
		input: readStream,
		crlfDelay: Infinity,
	});

	for await (const line of lineReader) {
		yield line;
	}
}
