import { Component, signal } from '@angular/core';
import { TicketStore } from '../services/ticket-store.service';
import { Signal } from '@angular/core';
import { ProgressSpinner } from 'primeng/progressspinner';
import { TicketService } from '../services/ticket.service';
import { BugTicket } from '../models/BugTicket';

@Component({
    selector: 'app-bug-tickets',
    templateUrl: 'bug-tickets.html',
    imports: [ProgressSpinner],
})
export class AppBugTickets {
    protected bugTickets!: Signal<BugTicket[]>;

    loading = signal<boolean>(true);

    constructor(private ticketService: TicketService, private ticketStore: TicketStore) {
        // bind to the central store's tickets signal
        this.bugTickets = this.ticketStore.tickets;

        // fake async load using the service; TicketService will populate the store
        this.ticketService.fetchTickets().then(() => {
            this.loading.set(false);
        });
    }
}
