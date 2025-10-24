import { Component, signal } from '@angular/core';
import { AppBarChart } from '../../components/chart/bar/BarChart';
import { AppPolarChart } from '../../components/chart/polar/PolarChart';
import { BugTicket, mockTickets } from './mock/tickets';

@Component({
    selector: 'app-bug-metrics',
    templateUrl: './bug-metrics.html',
    imports: [AppBarChart, AppPolarChart],
})
export class AppBugMetrics {
    protected bugTickets = signal<BugTicket[]>(mockTickets);
}
