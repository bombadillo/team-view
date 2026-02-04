import { Component } from "@angular/core";
import { ChartModule } from "primeng/chart";
import { AppBugMetrics } from "../../features/bugs/bug-metrics/BugMetrics";
import { AppBugTickets } from "../../features/bugs/bug-tickets/BugTickets";
import { FilterMenu } from "../../features/filters/filter-menu/FilterMenu";

@Component({
    selector: 'app-bugs',
    templateUrl: './bugs.html',
    imports: [ChartModule, AppBugMetrics, AppBugTickets, FilterMenu]
})
export class AppBugs {

}