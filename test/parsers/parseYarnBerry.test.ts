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

	test("Has 5 dependencies", async () => {
		const reader = () =>
			byLineReader(`
				"yarn_classic@workspace:.":
					version: 0.0.0-use.local
					resolution: "yarn_classic@workspace:."
					dependencies:
						file-package: "file:file-package"
						link-package: "link:link-package"
						react: ^18.2.0
						typescript: ^5.1.6
						xlsx: "file:vendor/xlsx-0.20.0.tgz"
					languageName: unknown
					linkType: soft
			`);
		const packagesInfo = await parseYarnBerry(reader);
		const dependencies = first(packagesInfo).dependencies;

		expect(packagesInfo).toHaveLength(1);
		expect(dependencies).toHaveLength(5);
	});

	test("Has js-tokens dependency", async () => {
		const reader = () =>
			byLineReader(`
				"loose-envify@npm:^1.1.0":
					version: 1.4.0
					resolution: "loose-envify@npm:1.4.0"
					dependencies:
						js-tokens: ^3.0.0 || ^4.0.0
					bin:
						loose-envify: cli.js
					checksum: 6517e24e0cad87ec9888f500c5b5947032cdfe6ef65e1c1936a0c48a524b81e65542c9c3edc91c97d5bddc806ee2a985dbc79be89215d613b1de5db6d1cfe6f4
					languageName: node
					linkType: hard
			`);
		const packagesInfo = await parseYarnBerry(reader);
		const dependencies = first(packagesInfo).dependencies;

		expect(packagesInfo).toHaveLength(1);
		expect(dependencies).toHaveLength(1);

		expect(first(dependencies).name).toBe("js-tokens");
		expect(first(dependencies).requestedVersion).toBe("^3.0.0 || ^4.0.0");
	});

	test("Can parse dependencies with @", async () => {
		const reader = () =>
			byLineReader(`
				"@auto-it/version-file@npm:10.37.6":
					version: 10.37.6
					resolution: "@auto-it/version-file@npm:10.37.6"
					dependencies:
						"@auto-it/core": 10.37.6
						fp-ts: ^2.5.3
						io-ts: ^2.1.2
						semver: ^7.0.0
						tslib: 1.10.0
					checksum: 6a68dc9ca871d6fb74dc79b9bfc50de413650e0b79da6a7e47fcb0cf847cbe277a5a025dd726cb58c5bccd91428c1faaf10bf0ba16fa75329c8a468604adec65
					languageName: node
					linkType: hard
			`);
		const packagesInfo = await parseYarnBerry(reader);
		const dependencies = first(packagesInfo).dependencies;

		expect(packagesInfo).toHaveLength(1);
		expect(dependencies).toHaveLength(5);

		expect(first(dependencies).name).toBe("@auto-it/core");
		expect(first(dependencies).requestedVersion).toBe("10.37.6");
	});

	test("Can parse peerDependencies", async () => {
		const reader = () =>
			byLineReader(`
				"ws@npm:~7.4.0":
					version: 7.4.6
					resolution: "ws@npm:7.4.6"
					peerDependencies:
						bufferutil: ^4.0.1
						utf-8-validate: ^5.0.2
					peerDependenciesMeta:
						bufferutil:
							optional: true
						utf-8-validate:
							optional: true
					checksum: 3a990b32ed08c72070d5e8913e14dfcd831919205be52a3ff0b4cdd998c8d554f167c9df3841605cde8b11d607768cacab3e823c58c96a5c08c987e093eb767a
					languageName: node
					linkType: hard
			`);

		const packagesInfo = await parseYarnBerry(reader);
		const dependencies = first(packagesInfo).dependencies;

		expect(packagesInfo).toHaveLength(1);
		expect(dependencies).toHaveLength(2);

		expect(dependencies).toStrictEqual([
			{ name: "bufferutil", requestedVersion: "^4.0.1" },
			{ name: "utf-8-validate", requestedVersion: "^5.0.2" },
		]);
	});

	test("Ignore conditions", async () => {
		const reader = () =>
			byLineReader(`
				"@esbuild/win32-x64@npm:0.18.20":
					version: 0.18.20
					resolution: "@esbuild/win32-x64@npm:0.18.20"
					conditions: os=win32 & cpu=x64
					languageName: node
					linkType: hard
			`);

		const packagesInfo = await parseYarnBerry(reader);
		const dependencies = first(packagesInfo).dependencies;

		expect(packagesInfo).toHaveLength(1);
		expect(dependencies).toHaveLength(0);
	});

	test("Ignore dependenciesMeta", async () => {
		const reader = () =>
			byLineReader(`
				"asar@npm:^3.1.0":
					version: 3.2.0
					resolution: "asar@npm:3.2.0"
					dependencies:
						"@types/glob": ^7.1.1
						chromium-pickle-js: ^0.2.0
						commander: ^5.0.0
						glob: ^7.1.6
						minimatch: ^3.0.4
					dependenciesMeta:
						"@types/glob":
							optional: true
					bin:
						asar: bin/asar.js
					checksum: f7d30b45970b053252ac124230bf319459d0728d7f6dedbe2f765cd2a83792d5a716d2c3f2861ceda69372b401f335e1f46460335169eadd0e91a0904a4f5a15
					languageName: node
					linkType: hard
			`);

		const packagesInfo = await parseYarnBerry(reader);
		const dependencies = first(packagesInfo).dependencies;

		expect(packagesInfo).toHaveLength(1);
		expect(dependencies).toHaveLength(5);

		expect(dependencies).toStrictEqual([
			{ name: "@types/glob", requestedVersion: "^7.1.1" },
			{ name: "chromium-pickle-js", requestedVersion: "^0.2.0" },
			{ name: "commander", requestedVersion: "^5.0.0" },
			{ name: "glob", requestedVersion: "^7.1.6" },
			{ name: "minimatch", requestedVersion: "^3.0.4" },
		]);
	});
});
