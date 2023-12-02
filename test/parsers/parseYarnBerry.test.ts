import { describe, expect, test } from "@jest/globals";
import { byLineReader } from "../helpers/byLineReader";

import { first } from "../../src/helpers/arrays";
import { parseYarnBerry } from "../../src/parsers/parseYarnBerry";

describe("parseYarnBerry", () => {
	test("Has typescript name", async () => {
		const reader = () =>
			byLineReader(`
				"typescript@npm:*, typescript@npm:5.1.6, typescript@npm:^5.1.6":
				version: 5.1.6
				resolution: "typescript@npm:5.1.6"
				bin:
					tsc: bin/tsc
					tsserver: bin/tsserver
				checksum: b2f2c35096035fe1f5facd1e38922ccb8558996331405eb00a5111cc948b2e733163cc22fab5db46992aba7dd520fff637f2c1df4996ff0e134e77d3249a7350
				languageName: node
				linkType: hard
			`);
		const packagesInfo = await parseYarnBerry(reader);

		expect(packagesInfo).toHaveLength(1);
		expect(first(packagesInfo).name).toBe("typescript");
	});

	test("Has requested versions *, 5.1.6, ^5.1.6", async () => {
		const reader = () =>
			byLineReader(`
				"typescript@npm:*, typescript@npm:5.1.6, typescript@npm:^5.1.6":
				version: 5.1.6
				resolution: "typescript@npm:5.1.6"
				bin:
					tsc: bin/tsc
					tsserver: bin/tsserver
				checksum: b2f2c35096035fe1f5facd1e38922ccb8558996331405eb00a5111cc948b2e733163cc22fab5db46992aba7dd520fff637f2c1df4996ff0e134e77d3249a7350
				languageName: node
				linkType: hard
			`);
		const packagesInfo = await parseYarnBerry(reader);

		expect(packagesInfo).toHaveLength(1);
		expect(first(packagesInfo).versions.requested).toStrictEqual(["*", "5.1.6", "^5.1.6"]);
	});

	test("Has resolved version 5.1.6", async () => {
		const reader = () =>
			byLineReader(`
				"typescript@npm:*, typescript@npm:5.1.6, typescript@npm:^5.1.6":
				version: 5.1.6
				resolution: "typescript@npm:5.1.6"
				bin:
					tsc: bin/tsc
					tsserver: bin/tsserver
				checksum: b2f2c35096035fe1f5facd1e38922ccb8558996331405eb00a5111cc948b2e733163cc22fab5db46992aba7dd520fff637f2c1df4996ff0e134e77d3249a7350
				languageName: node
				linkType: hard
			`);
		const packagesInfo = await parseYarnBerry(reader);

		expect(packagesInfo).toHaveLength(1);
		expect(first(packagesInfo).versions.resolved).toBe("5.1.6");
	});

	test("Doesn't have dependencies", async () => {
		const reader = () =>
			byLineReader(`
				"typescript@npm:*, typescript@npm:5.1.6, typescript@npm:^5.1.6":
				version: 5.1.6
				resolution: "typescript@npm:5.1.6"
				bin:
					tsc: bin/tsc
					tsserver: bin/tsserver
				checksum: b2f2c35096035fe1f5facd1e38922ccb8558996331405eb00a5111cc948b2e733163cc22fab5db46992aba7dd520fff637f2c1df4996ff0e134e77d3249a7350
				languageName: node
				linkType: hard
			`);
		const packagesInfo = await parseYarnBerry(reader);

		expect(packagesInfo).toHaveLength(1);
		expect(first(packagesInfo).dependencies).toHaveLength(0);
	});
});
