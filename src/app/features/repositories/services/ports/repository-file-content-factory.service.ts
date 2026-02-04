import { Injectable } from '@angular/core';
import { AzureDevopsRepositoryFileContentPort } from './azure-devops/azure-devops-repository-file-content.port';

@Injectable({ providedIn: 'root' })
export class RepositoryFileContentsPortFactoryService {
    constructor(private azureDevopsRepositoryFileContentPort: AzureDevopsRepositoryFileContentPort) {}

    getPort() {
        // change to just source? or keep it granular
        localStorage.setItem('bugSourcePort', 'AzureDevOps')
        const portSource = localStorage.getItem('bugSourcePort');

        console.log('portsource', portSource)

        if (!portSource) {
            throw 'No repository fileContent port source found';
        }

        switch( portSource) {
            case 'AzureDevOps': 
                return this.azureDevopsRepositoryFileContentPort;
                // return {};
            default:
                throw "No repository file content port source found";
        }
    }
}
