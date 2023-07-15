export type LockFileType = "yarn_classic" | "yarn_berry";

export interface PackageInfo {
	name: string;
	dependencies: DependencyInfo[];
	versions: {
		resolved: string;
		requested: string[];
	};
}

export interface DependencyInfo {
	name: string;
	requestedVersion: string;
}
