export interface Repository {
	id: string;
	name: string;
	url: string;
	defaultBranch: string;
	size: number;
	remoteUrl: string;
	sshUrl: string;
	webUrl: string;
	isDisabled: boolean;
	isInMaintenance: boolean;
	dotnetVersions?: string[] | null;
	owners?: string[] | null;
}
