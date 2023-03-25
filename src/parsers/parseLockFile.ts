import { parseYarnClassic } from "./parseYarnClassic";

import { type FileHandle } from "node:fs/promises";
import { type LockFileType } from "../types/domain";

export function parseLockFile(fileHandle: FileHandle, type: LockFileType = "yarn_classic") {
	switch (type) {
		case "yarn_classic":
			return parseYarnClassic(fileHandle);
		default:
			const _executiveCheck: never = type;
			return _executiveCheck;
	}
}
