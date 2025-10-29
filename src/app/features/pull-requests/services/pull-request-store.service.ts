import { Injectable, signal, Signal } from '@angular/core';
import { PullRequest } from '../models/PullRequest';

@Injectable({ providedIn: 'root' })
export class PullRequestStore {
    // internal mutable signal
    private _pullRequests = signal<PullRequest[]>([]);

    // public read-only signal that components can read directly
    readonly pullRequests: Signal<PullRequest[]> = this._pullRequests;

    setPullRequests(pullRequests: PullRequest[]) {
        this._pullRequests.set(pullRequests);
    }

    addTicket(ticket: PullRequest) {
        this._pullRequests.update((curr) => [...curr, ticket]);
    }

    clear() {
        this._pullRequests.set([]);
    }
}
