import { Injectable } from '@angular/core';
import { AzureDevopsRepositoryFilesPort } from './azure-devops/azure-devops-repository-files.port';

@Injectable({ providedIn: 'root' })
export class RepositoryFilesPortFactoryService {
    constructor(private azureDevopsRepositoryFilesPort: AzureDevopsRepositoryFilesPort) {}

    getPort() {
        // change to just source? or keep it granular
        localStorage.setItem('bugSourcePort', 'AzureDevOps')
        const portSource = localStorage.getItem('bugSourcePort');

        console.log('portsource', portSource)

        if (!portSource) {
            throw 'No repository files port source found';
        }

        switch( portSource) {
            case 'AzureDevOps': 
                return this.azureDevopsRepositoryFilesPort;
                // return {};
            default:
                throw "No repository files port source found";
        }
    }
}
