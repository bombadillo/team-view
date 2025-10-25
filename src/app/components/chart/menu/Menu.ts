import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { TicketService } from '../../../features/bugs/services/ticket.service';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.html',
    standalone: true,
    imports: [Menubar],
})
export class AppMenu implements OnInit {
    items: MenuItem[] | undefined;

    constructor(private ticketService: TicketService) {}

    ngOnInit() {
        this.items = [
            {
                label: 'Refresh',
                command: () => this.refresh(),
            },
        ];
    }

    refresh() {
        console.log('fetch');
        this.ticketService.fetchTickets(true);
    }
}
