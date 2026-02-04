export interface RepositoryFile {
	id: string;
	fileType: string;
	currentCommitId: string;
	path: string;
	isFolder: boolean;
	url: string;
}
