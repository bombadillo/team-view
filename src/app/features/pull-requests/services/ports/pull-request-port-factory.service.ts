import { Injectable } from '@angular/core';
import { AzureDevopsPullRequestPort } from './azure-devops/azure-devops-pull-request.port';

@Injectable({ providedIn: 'root' })
export class PullRequestPortFactoryService {
    constructor(private azureDevopsPullRequestPort: AzureDevopsPullRequestPort) {}

    getPort() {
        // change to just source? or keep it granular
        localStorage.setItem('bugSourcePort', 'AzureDevOps')
        const portSource = localStorage.getItem('bugSourcePort');

        console.log('portsource', portSource)

        if (!portSource) {
            throw 'No pull request port source found';
        }

        switch( portSource) {
            case 'AzureDevOps': 
                return this.azureDevopsPullRequestPort;
                // return {};
            default:
                throw "No pull request port source found";
        }
    }
}
