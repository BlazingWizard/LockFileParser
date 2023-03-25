import { open } from "node:fs/promises";
import { parseLockFile } from "./parsers/parseLockFile";

import { type Nullable } from "./types/common";
import { type FileHandle } from "node:fs/promises";

async function main(argv: string[]) {
	const path = argv[0];

	let fileHandle: Nullable<FileHandle> = undefined;
	try {
		fileHandle = await open(path, "r");
		const lockFile = parseLockFile(fileHandle);
		console.log(lockFile);
	} finally {
		if (!fileHandle) {
			return;
		}

		fileHandle.close();
	}
}

main(process.argv);
