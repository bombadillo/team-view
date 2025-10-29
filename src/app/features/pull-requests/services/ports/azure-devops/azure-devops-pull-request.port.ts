import { Inject, Injectable } from '@angular/core';
import { PullRequestPort } from '../pull-request.port';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { PullRequest } from '../../../models/PullRequest';
import { AzureDevOpsODataResponse, AzureDevOpsPullRequest } from './AzureDevOpsODataResponse';

@Injectable({ providedIn: 'root' })
export class AzureDevopsPullRequestPort implements PullRequestPort {
    // Implements PullRequestPort
    constructor(
        private http: HttpClient,
        @Inject('DEVOPS_PAT') private devopsPat: string,
        @Inject('DEVOPS_ORG') private devopsOrg: string,
        @Inject('DEVOPS_PROJECT') private devopsProject: string
    ) {}

    async getPullRequests(): Promise<PullRequest[]> {
        const cachedPullRequests = localStorage.getItem('devopsPullRequestResponse');
        if (cachedPullRequests) {
            console.log('returning cached pullRequests');

            return this.mapResponse(JSON.parse(cachedPullRequests));
        }

        const endpoint =
            `https://dev.azure.com/${this.devopsOrg}/${this.devopsProject}/_apis/git/pullrequests?` +
            'searchCriteria.status=completed' +
            '&$top=1000';
        const username = 'basic';
        const password = this.devopsPat;
        const authHeader = 'Basic ' + btoa(`${username}:${password}`);
        const response: AzureDevOpsODataResponse = (await firstValueFrom(
            this.http.get(endpoint, {
                headers: { Authorization: authHeader },
            })
        )) as AzureDevOpsODataResponse;

        console.log(response);

        localStorage.setItem('devopsPullRequestResponse', JSON.stringify(response.value));

        return this.mapResponse(response.value)
    }

    private async mapResponse(azureDevOpsPullRequests: AzureDevOpsPullRequest[]): Promise<PullRequest[]> {

        const pullRequests = azureDevOpsPullRequests.map((azurePullRequest) => {
            return {
                repository: azurePullRequest.repository,
                pullRequestId: azurePullRequest.pullRequestId,
                status: azurePullRequest.status,
                createdBy: azurePullRequest.createdBy,
                creationDate: azurePullRequest.creationDate,
                closedDate: azurePullRequest.closedDate,
                title: azurePullRequest.title,
                sourceRefName: azurePullRequest.sourceRefName,
                targetRefName: azurePullRequest.targetRefName,
                isDraft: azurePullRequest.isDraft,
                url: azurePullRequest.url,
            } as PullRequest;
        });

        console.log(pullRequests);

        return pullRequests;
    }
}
