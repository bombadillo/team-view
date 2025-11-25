import { Component, effect, signal } from '@angular/core';
import { TicketStore } from '../services/ticket-store.service';
import { Signal } from '@angular/core';
import { ProgressSpinner } from 'primeng/progressspinner';
import { TicketService } from '../services/ticket.service';
import { Ticket } from '../models/Ticket';

@Component({
    selector: 'app-ticket-list',
    templateUrl: 'ticket-list.html',
    imports: [ProgressSpinner],
})
export class AppTicketList {
    protected tickets!: Signal<Ticket[]>;

    loading = signal<boolean>(true);

    constructor(private ticketService: TicketService, private ticketStore: TicketStore) {
        this.tickets = this.ticketStore.tickets;

        this.ticketService.fetchTickets().then(() => {
            this.loading.set(false);
        });
    }
}
