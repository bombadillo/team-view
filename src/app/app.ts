import { Component, signal } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { AppBugMetrics } from './features/bugs/bug-metrics/BugMetrics';
import { AppBugTickets } from './features/bugs/bug-tickets/BugTickets';
import { AppMenu } from './components/chart/menu/Menu';
import { PullRequestMetrics } from "./features/pull-requests/pull-request-metrics/PullRequestMetrics";

@Component({
    selector: 'app-root',
    templateUrl: './app.html',
    styleUrl: './app.scss',
    imports: [ChartModule, AppBugMetrics, AppBugTickets, AppMenu, PullRequestMetrics],
})
export class App {
    protected readonly title = signal('team-view');
}
