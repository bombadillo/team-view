import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { BugTicketService } from '../../features/bugs/services/bug-ticket.service';
import { PullRequestService } from '../../features/pull-requests/services/pull-request.service';
import { TicketService } from '../../features/tickets/services/ticket.service';
import { FilterMenu } from "../../features/filters/filter-menu/FilterMenu";

@Component({
    selector: 'app-menu',
    templateUrl: './menu.html',
    standalone: true,
    imports: [Menubar, FilterMenu],
})
export class AppMenu implements OnInit {
    items: MenuItem[] | undefined;

    constructor(private bugTicketService: BugTicketService, private pullRequestService: PullRequestService, 
        private ticketService: TicketService
    ) {}

    ngOnInit() {
        this.items = [
            {
                label: 'Refresh',
                command: () => this.refresh(),
                
            },
            {
                label: 'Bugs',
                routerLink: '/'
            }, 
            {
                label: 'Tickets',
                routerLink: '/tickets'
            },            
            {
                label: 'Pull Requests',                
                routerLink: 'pull-requests'
            },
        ];
    }

    refresh() {
        // Do we move this to a more global state refresh service?
        console.log('fetch');
        this.bugTicketService.fetchTickets(true);
        this.ticketService.fetchTickets(true);
        this.pullRequestService.fetchPullRequests(true);
    }
}
