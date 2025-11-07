import { Component, computed, Signal, signal } from '@angular/core';
import { PullRequestService } from '../services/pull-request.service';
import { ProgressSpinner } from 'primeng/progressspinner';
import { AppBarChart } from '../../../components/chart/bar/BarChart';
import { PullRequest } from '../models/PullRequest';
import { PullRequestStore } from '../services/pull-request-store.service';

@Component({
    selector: 'app-pull-request-metrics',
    templateUrl: './pull-request-metrics.html',
    imports: [ProgressSpinner, AppBarChart],
})
export class PullRequestMetrics {
    loading = signal<boolean>(true);

    protected pullRequests!: Signal<PullRequest[]>;

    pullRequestMetrics: Signal<AppMetricMeta> = computed(() => this.getPullRequestsPerRepository());

    constructor(
        private pullRequestService: PullRequestService,
        private pullRequestStore: PullRequestStore
    ) {
        this.pullRequests = this.pullRequestStore.pullRequests;

        this.pullRequestService.fetchPullRequests().then(() => {
            console.log('fetched pull requests for metrics');
            this.loading.set(false);
        });
    }

    getPullRequestsPerRepository(): AppMetricMeta {
        console.log(this.pullRequests());
        const labels: string[] = [];

        this.pullRequests().map((pullRequest) => {
            const team = pullRequest.repository.name;

            if (!labels.includes(team)) labels.push(team);
        });
        labels.sort((a, b) => +a - +b);

        const data: number[] = labels.map((label) => {
            const pullRequests = this.pullRequests().filter((pullRequest) => {
                return pullRequest.repository.name === label;
            });

            return pullRequests.length;
        });

        return { labels, data } as AppMetricMeta;
    }
}
