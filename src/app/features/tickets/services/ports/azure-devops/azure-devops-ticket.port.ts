import { Inject, Injectable } from '@angular/core';
import { TicketPort } from '../ticket.port';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AzureDevOpsWorkItem } from './AzureDevOpsWorkItem';
import { AzureDevOpsODataResponse } from './AzureDevOpsODataResponse';
import { AzureDevOpsTeamsPort } from './azure-devops-teams.port';
import { Ticket } from '../../../models/Ticket';
import { AzureDevOpsUsersPort } from './azure-devops-users.port';
import { AzureDevOpsTicketRevisionsPort } from './azure-devops-ticket-revisions.port';

@Injectable({ providedIn: 'root' })
export class AzureDevopsTicketPort implements TicketPort {
    constructor(
        private http: HttpClient,
        private azureDevOpsTeamsPort: AzureDevOpsTeamsPort,
        private azureDevOpsUsersPort: AzureDevOpsUsersPort,
        private azureDevOpsTicketRevisionsPort: AzureDevOpsTicketRevisionsPort,
        @Inject('DEVOPS_CONFIG') private devopsConfig: any
    ) {}

    async getTickets(force: boolean = false): Promise<Ticket[]> {
        const cachedTickets = localStorage.getItem('devopsTicketResponse');
        if (cachedTickets && !force) {
            console.log('returning cached tickets');

            return this.mapResponse(JSON.parse(cachedTickets));
        }

        console.log(this.devopsConfig);

        const endpoint =
            `https://analytics.dev.azure.com/${this.devopsConfig.org}/${this.devopsConfig.project}/_odata/v3.0-preview/WorkItems?` +
            '$select=WorkItemId,Title,WorkItemType,State,FoundIn,CreatedDate,AreaSK,CreatedDateSK,AssignedToUserSK' +
            "&$filter=WorkItemType eq 'Product Backlog Item' and CreatedDateSK gt 20251117 and AssignedToUserSK ne null" +
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

        localStorage.setItem('devopsTicketResponse', JSON.stringify(response.value));

        return this.mapResponse(response.value);
    }

    private async mapResponse(workItems: AzureDevOpsWorkItem[]): Promise<Ticket[]> {
        const teams = await this.azureDevOpsTeamsPort.getTeams();
        const users = await this.azureDevOpsUsersPort.getUsers();

        // const ticketRevisions = await this.azureDevOpsTicketRevisionsPort.getTicketRevisions(
        //     workItems[0].WorkItemId
        // );
        // console.log(ticketRevisions);

        const tickets = await Promise.all(
            workItems
                .filter((azureTicket) => azureTicket.State !== 'Removed')
                .map(async (azureTicket) => {
                    // const ticketRevisions =
                    //     await this.azureDevOpsTicketRevisionsPort.getTicketRevisions(
                    //         azureTicket.WorkItemId
                    //     );

                    return {
                        id: azureTicket.WorkItemId.toString(),
                        title: azureTicket.Title,
                        status: azureTicket.State.replace(/ /g, ''),
                        team: teams.find((x) => x.id === azureTicket.AreaSK)?.name || 'Unknown',
                        user:
                            users.find((x) => x.id === azureTicket.AssignedToUserSK)?.name ||
                            'Unknown',
                        created: new Date(azureTicket.CreatedDate),
                        assignee: azureTicket.AssignedToUserSK,
                        // revisions: ticketRevisions,
                    } as Ticket;
                })
        );

        return tickets;
    }

    async getTicketRevisions(workItemId: number, force: boolean = false): Promise<Ticket[]> {
        const ticketRevisions = await this.azureDevOpsTicketRevisionsPort.getTicketRevisions(
            workItemId,
            force
        );

        return ticketRevisions;
    }
}
