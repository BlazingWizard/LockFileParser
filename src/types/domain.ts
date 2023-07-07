export type LockFileType = "yarn_classic";

export interface PackageInfo {
	name: string;
	dependencies: string[];
	versions: {
		resolved: string;
		requested: string[];
	};
}
