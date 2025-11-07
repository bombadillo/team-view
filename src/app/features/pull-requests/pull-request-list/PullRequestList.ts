import { Component, signal, Signal } from '@angular/core';
import { PullRequestService } from '../services/pull-request.service';
import { PullRequestStore } from '../services/pull-request-store.service';
import { ProgressSpinner } from 'primeng/progressspinner';
import { PullRequest } from '../models/PullRequest';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-pull-request-list',
    templateUrl: './pull-request-list.html',
    imports: [ProgressSpinner, DatePipe],
})
export class AppPullRequestList {
    protected pullRequests!: Signal<PullRequest[]>;

    loading = signal<boolean>(true);

    constructor(
        private pullRequestService: PullRequestService,
        private pullRequestStore: PullRequestStore
    ) {
        this.pullRequests = this.pullRequestStore.pullRequests;

        this.pullRequestService.fetchPullRequests().then(() => {
            this.loading.set(false);
        });
    }
}