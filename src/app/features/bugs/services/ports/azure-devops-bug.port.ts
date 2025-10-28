import { Injectable } from '@angular/core';
import { BugPort } from './bug.port';
import { BugTicket } from '../../models/BugTicket';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AzureDevOpsWorkItem } from './AzureDevOpsWorkItem';
import { AzureDevOpsODataResponse } from './AzureDevOpsODataResponse';
import { AzureDeveopsTeamsPort } from './azure-devops-teams.port';
import { Team } from '../../../teams/models/Team';

@Injectable({ providedIn: 'root' })
export class AzureDevopsBugPort implements BugPort {
    // Implements BugPort
    constructor(private http: HttpClient, private azureDevOpsTeamsPort: AzureDeveopsTeamsPort) {}

    async getBugs(): Promise<BugTicket[]> {
        const cachedBugs = localStorage.getItem('devopsBugResponse');
        if (cachedBugs) {
            console.log('returning cached bugs');

            return this.mapResponse(cachedBugs);
        }

        const endpoint =
            'https://analytics.dev.azure.com/{org}/{projectId}/_odata/v3.0-preview/WorkItems?' +
            '$select=WorkItemId,Title,WorkItemType,State,FoundIn,CreatedDate,AreaSK,CreatedDateSK' +
            "&$filter=WorkItemType eq 'Bug' and CreatedDateSK gt 20250101" +
            '&$orderby=CreatedDate desc' +
            '&$top=1000';
        const username = 'basic';
        const password =
            '';
        const authHeader = 'Basic ' + btoa(`${username}:${password}`);
        const response: AzureDevOpsODataResponse = (await firstValueFrom(
            this.http.get(endpoint, {
                headers: { Authorization: authHeader },
            })
        )) as AzureDevOpsODataResponse;

        // const bugTickets: BugTicket[] = response.

        console.log(response);

        localStorage.setItem('devopsBugResponse', JSON.stringify(response.value));

        return [] as BugTicket[];
    }

    private async mapResponse(serverResponse: string): Promise<BugTicket[]> {
        const bugsParsed: AzureDevOpsWorkItem[] = JSON.parse(serverResponse);
        console.log(bugsParsed);

        const teams = await this.azureDevOpsTeamsPort.getTeams();
        console.log(teams);

        const bugTickets = bugsParsed
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

        console.log(bugTickets);

        return bugTickets;
    }
}
 