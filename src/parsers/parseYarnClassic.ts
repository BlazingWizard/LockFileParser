import { first } from "../helpers/arrays";
import { getEmptyPackageInfo } from "../helpers/packageHelper";

import { type Reader } from "../types/common";
import { type PackageInfo } from "../types/domain";

export async function parseYarnClassic(byLineReader: Reader) {
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
			currentPackageInfo.versions.resolved = parseVersion(trimmedLine);

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

	const ignoredProps = ["resolved", "integrity", "dependencies"];
	const isIgnoredProps = ignoredProps.find((prop) => trimmedLine.startsWith(prop));

	return isEmpty || isComment || isIgnoredProps;
}

function parseName(nameRaw: string): [string, string[]] {
	const nameWithVersions = nameRaw
		.slice(0, nameRaw.length - 1)
		.split(", ")
		.map(splitNameAndVersion);

	const versions = nameWithVersions.map((nv) => nv.version);
	return [first(nameWithVersions).name, versions];
}

function splitNameAndVersion(nameWithVersion: string) {
	const str = nameWithVersion.replaceAll('"', "");
	const lastAtIndex = str.lastIndexOf("@");

	const name = str.slice(0, lastAtIndex);
	const version = str.slice(lastAtIndex + 1);

	return { name, version };
}

function parseVersion(version: string) {
	// TODO parsing
	return version;
}

function parseDependency(dependency: string) {
	// TODO parsing
	return {
		name: dependency,
		requestedVersion: dependency,
	};
}
