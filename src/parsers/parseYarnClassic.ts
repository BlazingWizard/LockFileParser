import { readFileByLine } from "../helpers/readFile";
import { getEmptyPackageInfo } from "../helpers/packageHelper";

import { type FileHandle } from "node:fs/promises";
import { type PackageInfo } from "../types/domain";

export async function parseYarnClassic(fileHandle: FileHandle) {
	const packages: PackageInfo[] = [];
	let currentPackageInfo: PackageInfo = getEmptyPackageInfo();

	for await (const line of readFileByLine(fileHandle)) {
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

function parseName(name: string): [string, string[]] {
	// TODO parsing
	return [name, [name]];
}

function parseVersion(version: string) {
	// TODO parsing
	return version;
}

function parseDependency(dependency: string) {
	// TODO parsing
	return dependency;
}
