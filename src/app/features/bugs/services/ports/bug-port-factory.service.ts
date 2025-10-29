import { Injectable } from '@angular/core';
import { AzureDevopsBugPort } from './azure-devops/azure-devops-bug.port';

@Injectable({ providedIn: 'root' })
export class BugPortFactoryService {
    constructor(private azureDevopsBugPort: AzureDevopsBugPort) {}

    getPort() {
        localStorage.setItem('bugSourcePort', 'AzureDevOps')
        const portSource = localStorage.getItem('bugSourcePort');

        console.log('portsource', portSource)

        if (!portSource) {
            throw 'No bug port source found';
        }

        switch( portSource) {
            case 'AzureDevOps': 
                return this.azureDevopsBugPort;
                // return {};
            default:
                throw "No bug port source found";
        }
    }
}
