import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AzureDevopsRepositoryFileContentPort {
	constructor(
		private http: HttpClient,
		@Inject('DEVOPS_CONFIG') private devopsConfig: any
	) {}

	async getRepositoryFileContents(repositoryId: string, path: string, force: boolean): Promise<string> {

		const endpoint =
			`https://dev.azure.com/${this.devopsConfig.org}/${this.devopsConfig.project}/_apis/git/repositories/${repositoryId}/items?path=${path}&api-version=7.0`; 
		const username = 'basic';
		const password = this.devopsConfig.pat;
		const authHeader = 'Basic ' + btoa(`${username}:${password}`);
		const response = await firstValueFrom(
			this.http.get(endpoint, {
				headers: { Authorization: authHeader, Accept: '*/*' },
				responseType: 'text' as 'text',
			})
		);

		return response;
	}
}

