import { Component, signal } from '@angular/core';
import { TicketService } from './services/ticket.service';
import { BugTicket } from './models/BugTicket';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
    selector: 'app-bug-tickets',
    templateUrl: 'bug-tickets.html',
    imports: [ProgressSpinner],
})
export class AppBugTickets {
    protected bugTickets = signal<BugTicket[]>([]);

    loading = signal<boolean>(true);

    constructor(private ticketService: TicketService) {
        // fake async load using the service
        this.ticketService.fetchTickets().then((tickets) => {
            this.loading.set(false);
            this.bugTickets.set(tickets);
        });
    }
}
