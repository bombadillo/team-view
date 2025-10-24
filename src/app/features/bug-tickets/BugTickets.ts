import { Component, signal } from '@angular/core';
import { BugTicket, mockTickets } from './mock/tickets';

@Component({
    selector: 'app-bug-tickets',
    templateUrl: 'bug-tickets.html',
})
export class AppBugTickets {
    protected bugTickets = signal<BugTicket[]>(mockTickets);
}
