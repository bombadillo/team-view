import { Component, signal } from "@angular/core";
import { PullRequestService } from "../services/pull-request.service";

@Component({
    selector: 'app-pull-request-metrics',
    templateUrl: './pull-request-metrics.html'
})
export class PullRequestMetrics {
    loading = signal<boolean>(true);

    constructor(private pullRequestService: PullRequestService) {
        this.pullRequestService.fetchPullRequests().then(() => {
            console.log('fetched pull requests for metrics');
            this.loading.set(false);
        });
    }
                    
}