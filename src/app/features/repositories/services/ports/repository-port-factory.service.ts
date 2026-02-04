import { Injectable } from '@angular/core';
import { AzureDevopsRepositoryPort } from './azure-devops/azure-devops-repository.port';

@Injectable({ providedIn: 'root' })
export class RepositoryPortFactoryService {
    constructor(private azureDevopsRepositoryPort: AzureDevopsRepositoryPort) {}

    getPort() {
        // change to just source? or keep it granular
        localStorage.setItem('bugSourcePort', 'AzureDevOps')
        const portSource = localStorage.getItem('bugSourcePort');

        console.log('portsource', portSource)

        if (!portSource) {
            throw 'No repository port source found';
        }

        switch( portSource) {
            case 'AzureDevOps': 
                return this.azureDevopsRepositoryPort;
                // return {};
            default:
                throw "No repository port source found";
        }
    }
}
