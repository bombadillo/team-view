import { Component } from '@angular/core';
import { AppTicketList } from '../../features/tickets/ticket-list/TicketList';
import { AppTicketMetrics } from '../../features/tickets/ticket-metrics/TicketMetrics';

@Component({
    selector: 'app-tickets',
    templateUrl: './tickets.html',
    imports: [AppTicketList, AppTicketMetrics],
})
export class AppTickets {}
