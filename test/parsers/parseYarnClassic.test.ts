import { describe, expect, test } from "@jest/globals";
import { byLineReader } from "../helpers/byLineReader";
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
		const packageInfo = await parseYarnClassic(reader);

		expect(packageInfo).toHaveLength(1);
		expect(packageInfo[0].name).toStrictEqual("typescript");
	});
});
