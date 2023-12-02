import { readFileByLine } from "../helpers/readFile";
import { parseYarnClassic } from "./parseYarnClassic";
import { parseYarnBerry } from "./parseYarnBerry";

import { type FileHandle } from "node:fs/promises";
import { type LockFileType } from "../types/domain";

export async function parseLockFile(fileHandle: FileHandle, type: LockFileType = "yarn_berry") {
	const reader = () => readFileByLine(fileHandle);
	switch (type) {
		case "yarn_classic":
			return await parseYarnClassic(reader);
		case "yarn_berry":
			return await parseYarnBerry(reader);
		default:
			const _executiveCheck: never = type;
			return _executiveCheck;
	}
}
