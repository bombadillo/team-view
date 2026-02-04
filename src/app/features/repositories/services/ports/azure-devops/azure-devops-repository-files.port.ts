import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AzureDevOpsRepositoryFile, AzureDevOpsRepositoryFileResponse } from './AzureDevOpsRepositoryFileResponse';
import { RepositoryFile } from '../../../models/RepositoryFile';

@Injectable({ providedIn: 'root' })
export class AzureDevopsRepositoryFilesPort {
	constructor(
		private http: HttpClient,
		@Inject('DEVOPS_CONFIG') private devopsConfig: any
	) {}

	async getRepositoryFiles(repositoryId: string, force: boolean): Promise<RepositoryFile[] | null> {
		const endpoint =
			`https://dev.azure.com/${this.devopsConfig.org}/${this.devopsConfig.project}/_apis/git/repositories/${repositoryId}/items?recursionLevel=Full&includeContentMetadata=false&api-version=7.0`; 
		const username = 'basic';
		const password = this.devopsConfig.pat;
		const authHeader = 'Basic ' + btoa(`${username}:${password}`);

		try {
		const response: AzureDevOpsRepositoryFileResponse = (await firstValueFrom(
			this.http.get(endpoint, {
				headers: { Authorization: authHeader },
			})
		)) as AzureDevOpsRepositoryFileResponse;

		return this.mapResponse(response.value);
		} catch(error) {
			console.log('error fetching repository items')
			console.log(error)
		}
		return null;
	}

	private async mapResponse(azureDevOpsFiles: AzureDevOpsRepositoryFile[]): Promise<RepositoryFile[]> {
		const files = azureDevOpsFiles.map((azureFile: AzureDevOpsRepositoryFile) => {
			return {
				id: azureFile.objectId,
				fileType: azureFile.gitObjectType,
				currentCommitId: azureFile.commitId,
				path: azureFile.path,
				isFolder: azureFile.isFolder,
				url: azureFile.url,
			} as RepositoryFile;
		});

		return files;
	}
}

