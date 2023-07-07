import { parseLockFile } from "../../../src/parsers/parseLockFile";
import { open } from "node:fs/promises";
import { join } from "node:path";
import { describe, test, expect } from "@jest/globals";

describe("parseLockFile", () => {
	test("Parse yarn v1 (classic) lock file", async () => {
		const path = join(__dirname, "yarn_lockfile_v1.txt");
		const fileHandle = await open(path, "r");
		const packageInfo = await parseLockFile(fileHandle);
		await fileHandle.close();

		expect(packageInfo).toHaveLength(8);
	});
});
