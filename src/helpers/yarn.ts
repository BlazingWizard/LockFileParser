import { first } from "./arrays";

export function parseName(nameRaw: string): [string, string[]] {
	const nameWithVersions = nameRaw
		.slice(0, nameRaw.length - 1)
		.split(", ")
		.map(splitNameAndVersion);

	const versions = nameWithVersions.map((nv) => nv.version.replace("npm:", ""));
	return [first(nameWithVersions).name, versions];
}

function splitNameAndVersion(nameWithVersion: string) {
	const str = nameWithVersion.replaceAll('"', "");
	const lastAtIndex = str.lastIndexOf("@");

	const name = str.slice(0, lastAtIndex);
	const version = str.slice(lastAtIndex + 1);

	return { name, version };
}

export function parseVersion(versionRaw: string) {
	const str = versionRaw.replaceAll('"', "");
	const firstSpaceIndex = str.indexOf(" ");

	const name = str.slice(0, firstSpaceIndex).replace(/:$/, "");
	const version = str.slice(firstSpaceIndex + 1);

	return { name, version };
}

export function parseDependency(dependency: string) {
	const dependencyInfo = parseVersion(dependency);
	return {
		name: dependencyInfo.name,
		requestedVersion: dependencyInfo.version,
	};
}
