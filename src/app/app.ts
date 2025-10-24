import { Component, signal } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { AppBugMetrics } from './features/bugs/bug-metrics/BugMetrics';
import { AppBugTickets } from './features/bugs/bug-tickets/BugTickets';

@Component({
    selector: 'app-root',
    templateUrl: './app.html',
    styleUrl: './app.scss',
    imports: [ChartModule, AppBugMetrics, AppBugTickets],
})
export class App {
    protected readonly title = signal('team-view');
}
