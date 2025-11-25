import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AzureDevOpsODataResponse } from './AzureDevOpsODataResponse';
import { firstValueFrom } from 'rxjs';
import { Ticket } from '../../../models/Ticket';
import { AzureDevOpsWorkItem } from './AzureDevOpsWorkItem';
import { AzureDevOpsUsersPort } from './azure-devops-users.port';

@Injectable({
    providedIn: 'root',
})
export class AzureDevOpsTicketRevisionsPort {
    private lastSendTime: Date | null = null;
    private queue: Array<{
        workItemId: number;
        resolve: (value: Ticket[] | PromiseLike<Ticket[]>) => void;
        reject: (reason?: any) => void;
    }> = [];
    private processing = false;
    private delayMs = 150;

    constructor(
        private http: HttpClient,
        @Inject('DEVOPS_CONFIG') private devopsConfig: any,
        private azureDevOpsUsersPort: AzureDevOpsUsersPort
    ) {}

    async getTicketRevisions(workItemId: number, force: boolean = false): Promise<Ticket[]> {
        // Check cache first
        const cachedResponsesString = localStorage.getItem('devopsTicketRevisionResponse');
        const cachedTicketRevisions = cachedResponsesString
            ? JSON.parse(cachedResponsesString)
            : {};

        if (cachedTicketRevisions[workItemId] && !force) {
            console.log('returning cached ticket revisions', cachedTicketRevisions[workItemId]);
            return this.mapResponse(cachedTicketRevisions[workItemId]);
        }

        // Queue the request
        console.log('queueing request');
        return new Promise<Ticket[]>((resolve, reject) => {
            this.queue.push({ workItemId, resolve, reject });
            this.processQueue();
        });
    }

    private async processQueue() {
        if (this.processing) return;
        this.processing = true;
        while (this.queue.length > 0) {
            // const { workItemId, resolve, reject } = this.queue.shift()!;
            const batch = this.queue.splice(0, 10);
            await Promise.all(
                batch.map(async ({ workItemId, resolve, reject }) => {
                    try {
                        // Throttle: ensure at least delayMs between requests
                        if (this.lastSendTime) {
                            const elapsed = new Date().getTime() - this.lastSendTime.getTime();
                            if (elapsed < this.delayMs) {
                                await new Promise((res) => setTimeout(res, this.delayMs - elapsed));
                            }
                        }
                        this.lastSendTime = new Date();

                        // Make the API request
                        const endpoint =
                            `https://analytics.dev.azure.com/${this.devopsConfig.org}/${this.devopsConfig.project}/_odata/v3.0-preview/WorkItemRevisions?` +
                            `$filter=WorkItemId eq ${workItemId}` +
                            '&$select=WorkItemId, AssignedToUserSK' +
                            '&$apply=groupby((WorkItemId,AssignedToUserSK))';
                        const username = 'basic';
                        const password = this.devopsConfig.analyticsPat;
                        const authHeader = 'Basic ' + btoa(`${username}:${password}`);

                        const response: AzureDevOpsODataResponse = (await firstValueFrom(
                            this.http.get(endpoint, {
                                headers: { Authorization: authHeader },
                            })
                        )) as AzureDevOpsODataResponse;

                        const cachedResponsesString = localStorage.getItem(
                            'devopsTicketRevisionResponse'
                        );
                        const cachedResponses = cachedResponsesString
                            ? JSON.parse(cachedResponsesString)
                            : {};
                        console.log(cachedResponses);

                        cachedResponses[workItemId] = response.value;

                        localStorage.setItem(
                            'devopsTicketRevisionResponse',
                            JSON.stringify(cachedResponses)
                        );

                        const result = await this.mapResponse(response.value);
                        resolve(result);
                    } catch (err) {
                        reject(err);
                    }
                })
            );
        }
        this.processing = false;
    }

    private async mapResponse(workItems: AzureDevOpsWorkItem[]) {
        const users = await this.azureDevOpsUsersPort.getUsers();

        const ticketRevisions = workItems
            .filter((azureTicket) => azureTicket.State !== 'Removed')
            .map((azureTicket) => {
                return {
                    id: azureTicket.WorkItemId.toString(),
                    user:
                        users.find((x) => x.id === azureTicket.AssignedToUserSK)?.name || 'Unknown',
                    assignee: azureTicket.AssignedToUserSK,
                } as Ticket;
            });
        return ticketRevisions;
    }
}
