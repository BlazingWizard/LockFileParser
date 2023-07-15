export type LockFileType = "yarn_classic";

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
