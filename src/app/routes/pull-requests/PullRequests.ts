import { Component } from "@angular/core";
import { AppPullRequestList } from "../../features/pull-requests/pull-request-list/PullRequestList";
import { PullRequestMetrics } from "../../features/pull-requests/pull-request-metrics/PullRequestMetrics";
import { FilterMenu } from "../../features/filters/filter-menu/FilterMenu";

@Component({
    selector: 'app-pull-requests',
    templateUrl: './pull-requests.html',
    imports: [AppPullRequestList, PullRequestMetrics, FilterMenu]
})
export class AppPullRequests {

}