import { open } from "node:fs/promises";
import { parseLockFile } from "./parsers/parseLockFile";

import { type Nullable } from "./types/common";
import { type FileHandle } from "node:fs/promises";

async function main(argv: string[]) {
	const path = argv[2];

	let fileHandle: Nullable<FileHandle> = undefined;
	try {
		fileHandle = await open(path, "r");
		const lockFile = await parseLockFile(fileHandle);
	} finally {
		if (!fileHandle) {
			return;
		}

		fileHandle.close();
	}
}

main(process.argv);
