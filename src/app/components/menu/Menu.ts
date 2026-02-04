import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { BugTicketService } from '../../features/bugs/services/bug-ticket.service';
import { PullRequestService } from '../../features/pull-requests/services/pull-request.service';
import { TicketService } from '../../features/tickets/services/ticket.service';
import { RepositoryService } from '../../features/repositories/services/repository.service';
import { GlobalStore } from '../../services/global-store.service';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.html',
    standalone: true,
    imports: [Menubar],
})
export class AppMenu implements OnInit {
    items: MenuItem[] | undefined;

    constructor(
        private bugTicketService: BugTicketService,
        private pullRequestService: PullRequestService,
        private ticketService: TicketService,
        private repositoryService: RepositoryService,
        private globalStore: GlobalStore,
    ) {}

    ngOnInit() {
        this.items = [
            {
                label: 'Refresh',
                command: () => this.refresh(),
            },
            {
                label: 'Bugs',
                routerLink: '/',
            },
            {
                label: 'Tickets',
                routerLink: '/tickets',
            },
            {
                label: 'Pull Requests',
                routerLink: 'pull-requests',
            },
            {
                label: 'Code',
                routerLink: 'code',
            },
        ];
    }

    refresh() {
        // Do we move this to a more global state refresh service?
        console.log('trigger cache refresh');
        // this.bugTicketService.fetchTickets(true);
        // this.ticketService.fetchTickets(true);
        // this.pullRequestService.fetchPullRequests(true);
        // this.repositoryService.fetchRepositories(true);

        this.globalStore.triggerRefresh();
    }
}
