export interface AzureDevOpsRepositoryFileResponse {
    value: AzureDevOpsRepositoryFile[];
}

export interface AzureDevOpsRepositoryFile {
	objectId: string;
	gitObjectType: string;
	commitId: string;
	path: string;
	isFolder: boolean;
	url: string;
}