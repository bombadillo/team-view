import { Component } from '@angular/core';
import { AppTicketList } from '../../features/tickets/ticket-list/TicketList';
import { AppTicketMetrics } from '../../features/tickets/ticket-metrics/TicketMetrics';
import { FilterMenu } from '../../features/filters/filter-menu/FilterMenu';

@Component({
    selector: 'app-tickets',
    templateUrl: './tickets.html',
    imports: [AppTicketList, AppTicketMetrics, FilterMenu],
})
export class AppTickets {}
