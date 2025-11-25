import { Inject, Injectable } from '@angular/core';
import { mockTickets } from '../mock/tickets';
import { TicketStore } from './bug-ticket-store.service';
import { BugPortFactoryService } from './ports/bug-port-factory.service';

@Injectable({ providedIn: 'root' })
export class BugTicketService {
    sendingRequest: boolean = false;

    /**
     * Fake fetch that resolves the mockTickets after an optional delay (ms).
     */
    constructor(private store: TicketStore, private bugPortFactory: BugPortFactoryService, @Inject('MOCK_DATA') private mockData: boolean) {}

    async fetchTickets(force: boolean = false): Promise<boolean> {
        if (this.sendingRequest) {
            console.log('delaying request as existing one open');

            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(this.fetchTickets());
                }, 500);
            });
        }

        if (this.mockData) {
            console.log('using mock data')
            // random delay between 300ms and 2000ms to better mimic network latency
            const min = 300;
            const max = 2000;
            const delay = Math.floor(Math.random() * (max - min + 1)) + min;
            return new Promise((resolve) => {
                setTimeout(() => {
                    // populate central store when tickets are "loaded"
                    const randomCount =
                        Math.floor(Math.random() * (mockTickets.length - 40 + 1)) + 40;
                    const shuffled = [...mockTickets].sort(() => Math.random() - 0.5);
                    const randomSubset = shuffled.slice(0, randomCount);
                    this.store.setTickets(randomSubset);
                    this.sendingRequest = false;
                    resolve(true);
                }, delay);
            });
        }

        

        const bugPort = await this.bugPortFactory.getPort();
        const bugTickets = await bugPort.getBugs(force);

        this.store.setTickets(bugTickets);
        this.sendingRequest = false;

        return true;
    }
}
