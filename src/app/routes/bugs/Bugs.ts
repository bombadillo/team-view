import { Component } from "@angular/core";
import { ChartModule } from "primeng/chart";
import { AppBugMetrics } from "../../features/bugs/bug-metrics/BugMetrics";
import { AppBugTickets } from "../../features/bugs/bug-tickets/BugTickets";
import { AppMenu } from "../../components/menu/Menu";
import { PullRequestMetrics } from "../../features/pull-requests/pull-request-metrics/PullRequestMetrics";

@Component({
    selector: 'app-bugs',
    templateUrl: './bugs.html',
    imports: [ChartModule, AppBugMetrics, AppBugTickets]
})
export class AppBugs {

}