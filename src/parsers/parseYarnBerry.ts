import { getEmptyPackageInfo } from "../helpers/packageHelper";
import { parseDependency, parseName, parseVersion } from "../helpers/yarn";

import { type Reader } from "../types/common";
import { type PackageInfo } from "../types/domain";

export async function parseYarnBerry(byLineReader: Reader) {
	const packages: PackageInfo[] = [];
	let currentPackageInfo: PackageInfo = getEmptyPackageInfo();

	for await (const line of byLineReader()) {
		if (isIgnoredLine(line)) {
			continue;
		}

		if (/^\S/.test(line)) {
			if (currentPackageInfo.name !== "") {
				packages.push(currentPackageInfo);
			}
			currentPackageInfo = getEmptyPackageInfo();

			const [name, versions] = parseName(line);
			currentPackageInfo.name = name;
			currentPackageInfo.versions.requested = versions;

			continue;
		}

		const trimmedLine = line.trim();
		if (trimmedLine.startsWith("version")) {
			currentPackageInfo.versions.resolved = parseVersion(trimmedLine).version;

			continue;
		}

		const dependency = parseDependency(trimmedLine);
		currentPackageInfo.dependencies.push(dependency);
	}

	packages.push(currentPackageInfo);

	return packages;
}

function isIgnoredLine(line: string) {
	const trimmedLine = line.trim();

	const isEmpty = trimmedLine === "";
	const isComment = trimmedLine.startsWith("#");

	const ignoredProps = [
		"__metadata",
		"bin",
		"cacheKey",
		"checksum",
		"dependencies",
		"languageName",
		"linkType",
		"resolution",
	];
	const isIgnoredProps = ignoredProps.find((prop) => trimmedLine.startsWith(prop));

	return isEmpty || isComment || isIgnoredProps;
}
