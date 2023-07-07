import { open } from "node:fs/promises";
import { join } from "node:path";
import { describe, test, expect } from "@jest/globals";
import { parseYarnClassic } from "../../../src/parsers/parseYarnClassic";

describe("parseYarnClassic", () => {
	test("Parse file", async () => {
		const path = join(__dirname, "yarn.lock");
		const fileHandle = await open(path, "r");
		const packageInfo = await parseYarnClassic(fileHandle);

		expect(packageInfo).toHaveLength(8);
	});
});
