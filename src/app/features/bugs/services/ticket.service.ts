import { Injectable } from '@angular/core';
import { mockTickets } from '../mock/tickets';
import { TicketStore } from '../../../services/ticket-store.service';

@Injectable({ providedIn: 'root' })
export class TicketService {
    sendingRequest: boolean = false;

    /**
     * Fake fetch that resolves the mockTickets after an optional delay (ms).
     */
    constructor(private store: TicketStore) {}

    fetchTickets(): Promise<boolean> {
        if (this.sendingRequest) {
            console.log('delaying request as existing one open');

            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(this.fetchTickets());
                }, 500);
            });
        }

        this.sendingRequest = true;

        if (this.store.tickets().length) {
            console.log('using cached tickets');
            return new Promise((resolve) => resolve(true));
        }

        console.log(this.store.tickets());

        console.log('fetching bugs from server');
        // random delay between 300ms and 2000ms to better mimic network latency
        const min = 300;
        const max = 2000;
        const delay = Math.floor(Math.random() * (max - min + 1)) + min;
        return new Promise((resolve) => {
            setTimeout(() => {
                // populate central store when tickets are "loaded"
                this.store.setTickets(mockTickets);
                this.sendingRequest = false;
                resolve(true);
            }, delay);
        });
    }
}
