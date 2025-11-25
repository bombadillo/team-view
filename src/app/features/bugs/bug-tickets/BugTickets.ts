import { Component, effect, signal } from '@angular/core';
import { TicketStore } from '../services/bug-ticket-store.service';
import { Signal } from '@angular/core';
import { ProgressSpinner } from 'primeng/progressspinner';
import { BugTicketService } from '../services/bug-ticket.service';
import { BugTicket } from '../models/BugTicket';

@Component({
    selector: 'app-bug-tickets',
    templateUrl: 'bug-tickets.html',
    imports: [ProgressSpinner],
})
export class AppBugTickets {
    protected bugTickets!: Signal<BugTicket[]>;

    loading = signal<boolean>(true);

    constructor(private ticketService: BugTicketService, private ticketStore: TicketStore) {
        this.bugTickets = this.ticketStore.tickets;

        this.ticketService.fetchTickets().then(() => {
            this.loading.set(false);
        });
    }
}
