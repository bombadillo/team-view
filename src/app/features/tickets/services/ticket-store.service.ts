import { Injectable, signal, Signal } from '@angular/core';
import { Ticket } from '../models/Ticket';

@Injectable({ providedIn: 'root' })
export class TicketStore {
    private _tickets = signal<Ticket[]>([]);
    private _ticketRevisions = signal<any>({});
    private _ticketRevisionProcessingPercentage = signal<number>(0);

    readonly tickets: Signal<Ticket[]> = this._tickets;
    readonly ticketRevisions: Signal<any> = this._ticketRevisions;
    readonly ticketRevisionProcessingPercentage = this._ticketRevisionProcessingPercentage;

    setTickets(tickets: Ticket[]) {
        this.clear();
        Promise.resolve().then(() => {
            this._tickets.set(tickets);
        });
    }

    addTicket(ticket: Ticket) {
        this._tickets.update((curr) => [...curr, ticket]);
    }

    setTicketRevisions(ticketRevisions: {}) {
        this._ticketRevisions.set([]);
        Promise.resolve().then(() => {
            this._ticketRevisions.set(ticketRevisions);
        });
    }

    setTicketRevisionProcessingPercentage(percentage: number) {
        Promise.resolve().then(() => {
            this._ticketRevisionProcessingPercentage.set(Math.ceil(percentage));
        });
    }

    addTicketRevision(workItemId: number, tickets: Ticket[]) {
        this._ticketRevisions.update((curr) => ({ ...curr, [workItemId]: tickets }));
    }

    clear() {
        this._tickets.set([]);
        this._ticketRevisions.set([]);
        this._ticketRevisionProcessingPercentage.set(0);
    }
}
