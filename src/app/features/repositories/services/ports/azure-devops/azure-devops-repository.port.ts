import { Inject, Injectable } from '@angular/core';
import { RepositoryPort } from '../repository.port';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {
    AzureDevOpsRepository,
    AzureDevOpsRepositoryResponse,
} from './AzureDevOpsRepositoryResponse';
import { Repository } from '../../../models/Repository';

@Injectable({ providedIn: 'root' })
export class AzureDevopsRepositoryPort implements RepositoryPort {
    // Implements RepositoryPort
    constructor(
        private http: HttpClient,
        @Inject('DEVOPS_CONFIG') private devopsConfig: any,
    ) {}

    async getRepositories(force: boolean): Promise<Repository[] | null> {
        const cachedRepositories = localStorage.getItem('devopsRepositoryResponse');
        if (cachedRepositories && !force) {
            console.log('returning cached repositories');

            return this.mapResponse(JSON.parse(cachedRepositories));
        }

        const endpoint = `https://dev.azure.com/${this.devopsConfig.org}/${this.devopsConfig.project}/_apis/git/repositories?`;
        const username = 'basic';
        const password = this.devopsConfig.pat;
        const authHeader = 'Basic ' + btoa(`${username}:${password}`);

        try {
            const response: AzureDevOpsRepositoryResponse = (await firstValueFrom(
                this.http.get(endpoint, {
                    headers: { Authorization: authHeader },
                }),
            )) as AzureDevOpsRepositoryResponse;

            localStorage.setItem('devopsRepositoryResponse', JSON.stringify(response.value));

            return this.mapResponse(response.value);
        } catch (error) {
            console.log('Repository fetch error')
            console.log(error)
        }

        return null;
    }

    private async mapResponse(
        azureDevOpsRepositories: AzureDevOpsRepository[],
    ): Promise<Repository[]> {
        const repositories = azureDevOpsRepositories.map((azureRepository: any) => {
            return {
                id: azureRepository.id,
                name: azureRepository.name,
                url: azureRepository.url,
                defaultBranch: azureRepository.defaultBranch,
                size: azureRepository.size,
                remoteUrl: azureRepository.remoteUrl,
                sshUrl: azureRepository.sshUrl,
                webUrl: azureRepository.webUrl,
                isDisabled: azureRepository.isDisabled,
                isInMaintenance: azureRepository.isInMaintenance,
            } as Repository;
        });

        return repositories;
    }
}
