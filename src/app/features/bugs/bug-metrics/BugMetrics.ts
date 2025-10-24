import { Component, Signal, signal } from '@angular/core';
import { AppBarChart } from '../../../components/chart/bar/BarChart';
import { AppPolarChart } from '../../../components/chart/polar/PolarChart';
import { TicketStore } from '../../../services/ticket-store.service';
import { BugTicket } from '../models/BugTicket';
import { ProgressSpinner } from 'primeng/progressspinner';
import { TicketService } from '../services/ticket.service';

@Component({
    selector: 'app-bug-metrics',
    templateUrl: './bug-metrics.html',
    imports: [AppBarChart, AppPolarChart, ProgressSpinner],
})
export class AppBugMetrics {
    protected bugTickets!: Signal<BugTicket[]>;

    loading = signal<boolean>(true);

    constructor(private ticketService: TicketService, private ticketStore: TicketStore) {
        // bind to the central store's tickets signal
        this.bugTickets = this.ticketStore.tickets;

        // fake async load using the service; TicketService will populate the store
        this.ticketService.fetchTickets().then(() => {
            console.log('fetched bugs for metrics');
            this.loading.set(false);
        });
    }
}
