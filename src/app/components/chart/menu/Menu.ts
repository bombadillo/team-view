import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { TicketService } from '../../../features/bugs/services/ticket.service';
import { PullRequestService } from '../../../features/pull-requests/services/pull-request.service';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.html',
    standalone: true,
    imports: [Menubar],
})
export class AppMenu implements OnInit {
    items: MenuItem[] | undefined;

    constructor(private ticketService: TicketService, private pullRequestService: PullRequestService) {}

    ngOnInit() {
        this.items = [
            {
                label: 'Refresh',
                command: () => this.refresh(),
            },
        ];
    }

    refresh() {
        // Do we move this to a more global state refresh service?
        console.log('fetch');
        this.ticketService.fetchTickets(true);
        this.pullRequestService.fetchPullRequests(true);
    }
}
