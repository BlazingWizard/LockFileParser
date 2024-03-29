import { describe, expect, test } from "@jest/globals";
import { byLineReader } from "../helpers/byLineReader";

import { first } from "../../src/helpers/arrays";
import { parseYarnClassic } from "../../src/parsers/parseYarnClassic";

describe("parseYarnClassic", () => {
	test("Has typescript name", async () => {
		const reader = () =>
			byLineReader(`
				typescript@*, typescript@5.1.6, typescript@>=5.1.6, typescript@^5.1.6:
					version "5.1.6"
					resolved "https://registry.yarnpkg.com/typescript/-/typescript-5.1.6.tgz#02f8ac202b6dad2c0dd5e0913745b47a37998274"
					integrity sha512-zaWCozRZ6DLEWAWFrVDz1H6FVXzUSfTy5FUMWsQlU8Ym5JP9eO4xkTIROFCQvhQf61z6O/G6ugw3SgAnvvm+HA==
			`);
		const packagesInfo = await parseYarnClassic(reader);

		expect(packagesInfo).toHaveLength(1);
		expect(first(packagesInfo).name).toBe("typescript");
	});

	test("Has requested versions *, 5.1.6, >=5.1.6, ^5.1.6", async () => {
		const reader = () =>
			byLineReader(`
				typescript@*, typescript@5.1.6, typescript@>=5.1.6, typescript@^5.1.6:
					version "5.1.6"
					resolved "https://registry.yarnpkg.com/typescript/-/typescript-5.1.6.tgz#02f8ac202b6dad2c0dd5e0913745b47a37998274"
					integrity sha512-zaWCozRZ6DLEWAWFrVDz1H6FVXzUSfTy5FUMWsQlU8Ym5JP9eO4xkTIROFCQvhQf61z6O/G6ugw3SgAnvvm+HA==
			`);
		const packagesInfo = await parseYarnClassic(reader);

		expect(packagesInfo).toHaveLength(1);
		expect(first(packagesInfo).versions.requested).toStrictEqual([
			"*",
			"5.1.6",
			">=5.1.6",
			"^5.1.6",
		]);
	});

	test("Has resolved version 5.1.6", async () => {
		const reader = () =>
			byLineReader(`
				typescript@*, typescript@5.1.6, typescript@>=5.1.6, typescript@^5.1.6:
					version "5.1.6"
					resolved "https://registry.yarnpkg.com/typescript/-/typescript-5.1.6.tgz#02f8ac202b6dad2c0dd5e0913745b47a37998274"
					integrity sha512-zaWCozRZ6DLEWAWFrVDz1H6FVXzUSfTy5FUMWsQlU8Ym5JP9eO4xkTIROFCQvhQf61z6O/G6ugw3SgAnvvm+HA==
			`);
		const packagesInfo = await parseYarnClassic(reader);

		expect(packagesInfo).toHaveLength(1);
		expect(first(packagesInfo).versions.resolved).toBe("5.1.6");
	});

	test("Has js-tokens dependency", async () => {
		const reader = () =>
			byLineReader(`
				loose-envify@^1.1.0:
					version "1.4.0"
					resolved "https://registry.yarnpkg.com/loose-envify/-/loose-envify-1.4.0.tgz#71ee51fa7be4caec1a63839f7e682d8132d30caf"
					integrity sha512-lyuxPGr/Wfhrlem2CL/UcnUc1zcqKAImBDzukY7Y5F/yQiNdko6+fRLevlw1HgMySw7f611UIY408EtxRSoK3Q==
					dependencies:
						js-tokens "^3.0.0 || ^4.0.0"
			`);
		const packagesInfo = await parseYarnClassic(reader);
		const dependencies = first(packagesInfo).dependencies;

		expect(packagesInfo).toHaveLength(1);
		expect(dependencies).toHaveLength(1);

		expect(first(dependencies).name).toBe("js-tokens");
		expect(first(dependencies).requestedVersion).toBe("^3.0.0 || ^4.0.0");
	});
});
