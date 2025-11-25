import { Injectable } from '@angular/core';
import { AzureDevopsTicketPort } from './azure-devops/azure-devops-ticket.port';

@Injectable({ providedIn: 'root' })
export class TicketPortFactoryService {
    constructor(private azureDevopsTicketPort: AzureDevopsTicketPort) {}

    getPort() {
        localStorage.setItem('ticketSourcePort', 'AzureDevOps')
        const portSource = localStorage.getItem('ticketSourcePort');

        console.log('portsource', portSource)

        if (!portSource) {
            throw 'No ticket port source found';
        }

        switch( portSource) {
            case 'AzureDevOps': 
                return this.azureDevopsTicketPort;
                // return {};
            default:
                throw "No ticket port source found";
        }
    }
}
