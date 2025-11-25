import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AzureDevOpsODataResponse } from './AzureDevOpsODataResponse';
import { firstValueFrom } from 'rxjs';
import { User } from '../../../models/User';
import { AzureDevOpsUser } from './AzureDevOpsUser';

@Injectable({
    providedIn: 'root',
})
export class AzureDevOpsUsersPort {
    constructor(private http: HttpClient, @Inject('DEVOPS_CONFIG') private devopsConfig: any) {}

    async getUsers() {
        const cachedUsers = localStorage.getItem('devopsUserResponse');
        if (cachedUsers) {
            console.log('returning cached users');

            return this.mapResponse(JSON.parse(cachedUsers));
        }

        const endpoint =
            `https://analytics.dev.azure.com/${this.devopsConfig.org}/${this.devopsConfig.project}/_odata/v3.0-preview/Users?`
            + '$select=UserSk,UserName';
        const username = 'basic';
        const password =
            this.devopsConfig.analyticsPat;
        const authHeader = 'Basic ' + btoa(`${username}:${password}`);

        const response: AzureDevOpsODataResponse = (await firstValueFrom(
            this.http.get(endpoint, {
                headers: { Authorization: authHeader },
            })
        )) as AzureDevOpsODataResponse;

        localStorage.setItem('devopsUserResponse', JSON.stringify(response.value));

        return [] as User[];
    }

    private mapResponse(devOpsUsers: AzureDevOpsUser[]) {
        

        const users = devOpsUsers.map((azureUser) => {
            return {
                id: azureUser.UserSK.toString(),
                name: azureUser.UserName,
            } as User;
        });


        return users;
    }
}
