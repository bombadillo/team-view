import { effect, Inject, Injectable } from '@angular/core';
import { mockTickets } from '../mock/tickets';
import { TicketStore } from './ticket-store.service';
import { TicketPortFactoryService } from './ports/ticket-port-factory.service';

@Injectable({ providedIn: 'root' })
export class TicketService {
    sendingRequest: boolean = false;
    revisions: any = [];
    startedGettingRevisions: boolean = false;
    force: boolean = false;

    /**
     * Fake fetch that resolves the mockTickets after an optional delay (ms).
     */
    constructor(
        private store: TicketStore,
        private ticketPortFactory: TicketPortFactoryService,
        @Inject('MOCK_DATA') private mockData: boolean
    ) {
        effect(async () => {
            if (this.store.tickets().length) {
                console.log('loading revisions!!!2');
                // maybe store an array here and update store in one go?
                const revisions = [] as any;
                await Promise.all(
                    this.store
                        .tickets()
                        .map(async (ticket) => {
                            const ticketRevisions = await this.fetchTicketRevisions(+ticket.id, this.force);
                            revisions[+ticket.id] = ticketRevisions
                            const percentMapped = this.store.tickets().length > 0 ? (Object.keys(revisions).length / this.store.tickets().length) * 100 : 0
                            this.store.setTicketRevisionProcessingPercentage(percentMapped);
                        })
                );
                
                // Fix the above code to remove the need for this
                if (this.mockData)
                    this.store.setTicketRevisionProcessingPercentage(100);

                this.store.setTicketRevisions(revisions);
            }
        });
    }

    async fetchTickets(force: boolean = false): Promise<boolean> {
        this.force = force;

        if (this.sendingRequest) {
            console.log('delaying request as existing one open');

            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(this.fetchTickets());
                }, 500);
            });
        }

        if (this.mockData) {
            console.log('using mock data');
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

        const ticketPort = await this.ticketPortFactory.getPort();
        const ticketTickets = await ticketPort.getTickets(force);

        this.store.setTickets(ticketTickets);
        this.sendingRequest = false;

        return true;
    }

    async fetchTicketRevisions(workItemId: number, force: boolean = false): Promise<any[]> {
        if (this.sendingRequest) {
            console.log('delaying request as existing one open');

            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(this.fetchTicketRevisions(workItemId, force));
                }, 500);
            });
        }

        if (this.mockData) {
            console.log('using mock data');
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
                    // this.store.setTicketRevisions(randomSubset);
                    this.sendingRequest = false;
                    resolve(randomSubset);
                }, delay);
            });
        }

        const ticketPort = await this.ticketPortFactory.getPort();
        const ticketRevisions = await ticketPort.getTicketRevisions(workItemId, force);

        this.sendingRequest = false;

        return ticketRevisions;
    }
}
