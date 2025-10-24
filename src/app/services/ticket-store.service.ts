import { Injectable, signal, Signal } from '@angular/core';
import { BugTicket } from '../features/bugs/bug-tickets/models/BugTicket';

@Injectable({ providedIn: 'root' })
export class TicketStore {
    // internal mutable signal
    private _tickets = signal<BugTicket[]>([]);

    // public read-only signal that components can read directly
    readonly tickets: Signal<BugTicket[]> = this._tickets;

    setTickets(tickets: BugTicket[]) {
        this._tickets.set(tickets);
    }

    addTicket(ticket: BugTicket) {
        this._tickets.update((curr) => [...curr, ticket]);
    }

    clear() {
        this._tickets.set([]);
    }
}
