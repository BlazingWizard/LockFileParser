import { type PackageInfo } from "../types/domain";

export function getEmptyPackageInfo(): PackageInfo {
	return {
		name: "",
		dependencies: [],
		versions: {
			resolved: "",
			requested: [],
		},
	};
}
