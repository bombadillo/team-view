import { Injectable } from '@angular/core';
import { mockTickets } from '../mock/tickets';
import { BugTicket } from '../models/BugTicket';

@Injectable({ providedIn: 'root' })
export class TicketService {
    /**
     * Fake fetch that resolves the mockTickets after an optional delay (ms).
     */
    fetchTickets(): Promise<BugTicket[]> {
        // random delay between 300ms and 2000ms to better mimic network latency
        const min = 300;
        const max = 3000;
        const delay = Math.floor(Math.random() * (max - min + 1)) + min;
        return new Promise((resolve) => {
            setTimeout(() => resolve(mockTickets), delay);
        });
    }
}
