import { Inject, Injectable } from '@angular/core';
import { BugPort } from '../bug.port';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AzureDevOpsWorkItem } from './AzureDevOpsWorkItem';
import { AzureDevOpsODataResponse } from './AzureDevOpsODataResponse';
import { AzureDeveopsTeamsPort } from './azure-devops-teams.port';
import { BugTicket } from '../../../models/BugTicket';

@Injectable({ providedIn: 'root' })
export class AzureDevopsBugPort implements BugPort {
    // Implements BugPort
    constructor(
        private http: HttpClient,
        private azureDevOpsTeamsPort: AzureDeveopsTeamsPort,
        @Inject('DEVOPS_CONFIG') private devopsConfig: any
    ) {}

    async getBugs(force: boolean = false): Promise<BugTicket[]> {
        const cachedBugs = localStorage.getItem('devopsBugResponse');
        if (cachedBugs && !force) {
            console.log('returning cached bugs');

            return this.mapResponse(JSON.parse(cachedBugs));
        }

        console.log(this.devopsConfig)

        const endpoint =
            `https://analytics.dev.azure.com/${this.devopsConfig.org}/${this.devopsConfig.project}/_odata/v3.0-preview/WorkItems?` +
            '$select=WorkItemId,Title,WorkItemType,State,FoundIn,CreatedDate,AreaSK,CreatedDateSK' +
            "&$filter=WorkItemType eq 'Bug' and CreatedDateSK gt 20250101" +
            '&$orderby=CreatedDate desc' +
            '&$top=1000';
        const username = 'basic';
        const password = this.devopsConfig.analyticsPat;
        const authHeader = 'Basic ' + btoa(`${username}:${password}`);
        const response: AzureDevOpsODataResponse = (await firstValueFrom(
            this.http.get(endpoint, {
                headers: { Authorization: authHeader },
            })
        )) as AzureDevOpsODataResponse;

        localStorage.setItem('devopsBugResponse', JSON.stringify(response.value));

        return this.mapResponse(response.value);
    }

    private async mapResponse(workItems: AzureDevOpsWorkItem[]): Promise<BugTicket[]> {
        const teams = await this.azureDevOpsTeamsPort.getTeams();

        const bugTickets = workItems
            .filter((azureBugTicket) => azureBugTicket.State !== 'Removed')
            .map((azureBugTicket) => {
                return {
                    id: azureBugTicket.WorkItemId.toString(),
                    title: azureBugTicket.Title,
                    status: azureBugTicket.State.replace(/ /g, ''),
                    team: teams.find((x) => x.id === azureBugTicket.AreaSK)?.name || 'Unknown',
                    created: new Date(azureBugTicket.CreatedDate),
                } as BugTicket;
            });

        return bugTickets;
    }
}
