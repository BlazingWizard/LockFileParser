import { readFileByLine } from "../helpers/readFile";
import { parseYarnClassic } from "./parseYarnClassic";

import { type FileHandle } from "node:fs/promises";
import { type LockFileType } from "../types/domain";

export async function parseLockFile(fileHandle: FileHandle, type: LockFileType = "yarn_classic") {
	switch (type) {
		case "yarn_classic":
			const reader = () => readFileByLine(fileHandle);
			return await parseYarnClassic(reader);
		default:
			const _executiveCheck: never = type;
			return _executiveCheck;
	}
}
