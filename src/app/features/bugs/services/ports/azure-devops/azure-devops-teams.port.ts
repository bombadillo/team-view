import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AzureDevOpsODataResponse } from './AzureDevOpsODataResponse';
import { firstValueFrom } from 'rxjs';
import { Team } from '../../../../teams/models/Team';
import { AzureDevopsTeam } from './AzureDevOpsTeam';

@Injectable({
    providedIn: 'root',
})
export class AzureDeveopsTeamsPort {
    constructor(private http: HttpClient) {}

    async getTeams() {
        const cachedTeams = localStorage.getItem('devopsTeamResponse');
        if (cachedTeams) {
            console.log('returning cached teams');

            return this.mapResponse(cachedTeams);
        }

        const endpoint =
            'https://analytics.dev.azure.com/{org}/{projectId}/_odata/v3.0-preview/Areas';
        const username = 'basic';
        const password =
            '';
        const authHeader = 'Basic ' + btoa(`${username}:${password}`);

        const response: AzureDevOpsODataResponse = (await firstValueFrom(
            this.http.get(endpoint, {
                headers: { Authorization: authHeader },
            })
        )) as AzureDevOpsODataResponse;

        localStorage.setItem('devopsTeamResponse', JSON.stringify(response.value));

        return [] as Team[];
    }

    private mapResponse(serverResponse: string) {
        const cachedTeams: AzureDevopsTeam[] = JSON.parse(serverResponse);
        console.log(cachedTeams);

        const teams = cachedTeams.map((azureTeam) => {
            return {
                id: azureTeam.AreaSK.toString(),
                name: azureTeam.AreaName,
            } as Team;
        });

        console.log(teams);

        return teams;
    }
}
