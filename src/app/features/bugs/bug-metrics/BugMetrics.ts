import { Component, computed, Signal, signal } from '@angular/core';
import { AppBarChart } from '../../../components/chart/bar/BarChart';
import { AppPolarChart } from '../../../components/chart/polar/PolarChart';
import { TicketStore } from '../../../services/ticket-store.service';
import { BugTicket } from '../models/BugTicket';
import { ProgressSpinner } from 'primeng/progressspinner';
import { TicketService } from '../services/ticket.service';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-bug-metrics',
    templateUrl: './bug-metrics.html',
    imports: [AppBarChart, AppPolarChart, ProgressSpinner, ButtonModule],
})
export class AppBugMetrics {
    protected bugTickets!: Signal<BugTicket[]>;

    loading = signal<boolean>(true);

    bugCount: Signal<number> = computed(() => {
        return this.bugTickets().length;
    });

    bugMetrics: Signal<AppMetricMeta> = computed(() => this.getBugsPerMonth());

    bugsPerTeamMetrics: Signal<AppMetricMeta> = computed(() => this.getBugsPerTeam());

    constructor(private ticketService: TicketService, private ticketStore: TicketStore) {
        // bind to the central store's tickets signal
        this.bugTickets = this.ticketStore.tickets;

        // fake async load using the service; TicketService will populate the store
        this.ticketService.fetchTickets().then(() => {
            console.log('fetched bugs for metrics');
            this.loading.set(false);
        });
    }

    getBugsPerMonth(): AppMetricMeta {
        const labels: string[] = [];

        this.bugTickets().map((bugTicket) => {
            const yearMonth = `${bugTicket.created.getFullYear()}${String(
                bugTicket.created.getMonth() + 1
            ).padStart(2, '0')}`;

            if (!labels.includes(yearMonth)) labels.push(yearMonth);
        });
        labels.sort((a, b) => +a - +b);
        console.log(labels);

        const data: number[] = labels.map((label) => {
            console.log(label);

            const bugTickets = this.bugTickets().filter((bugTicket) => {
                const yearMonth = `${bugTicket.created.getFullYear()}${String(
                    bugTicket.created.getMonth() + 1
                ).padStart(2, '0')}`;

                return yearMonth === label;
            });

            return bugTickets.length;
        });

        console.log(data);

        return { labels, data } as AppMetricMeta;
    }

    getBugsPerTeam(): AppMetricMeta {
        const labels: string[] = [];

        this.bugTickets().map((bugTicket) => {
            const team = bugTicket.team;

            if (!labels.includes(team)) labels.push(team);
        });
        labels.sort((a, b) => +a - +b);
        console.log(labels);

        const data: number[] = labels.map((label) => {
            console.log(label);

            const bugTickets = this.bugTickets().filter((bugTicket) => {
                return bugTicket.team === label;
            });

            return bugTickets.length;
        });

        console.log(data);

        return { labels, data } as AppMetricMeta;
    }

    refresh() {
        console.log('fetch');
        this.ticketService.fetchTickets(true).then(() => {
            console.log('fetched bugs for metrics');
            this.loading.set(false);
        });
    }
}
