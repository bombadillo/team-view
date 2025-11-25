import { Component, computed, effect, Signal, signal } from '@angular/core';
import { AppBarChart } from '../../../components/chart/bar/BarChart';
import { AppPolarChart } from '../../../components/chart/polar/PolarChart';
import { TicketStore } from '../services/ticket-store.service';
import { Ticket } from '../models/Ticket';
import { ProgressSpinner } from 'primeng/progressspinner';
import { ProgressBar } from 'primeng/progressbar';
import { TicketService } from '../services/ticket.service';

@Component({
    selector: 'app-ticket-metrics',
    templateUrl: './ticket-metrics.html',
    imports: [AppBarChart, AppPolarChart, ProgressSpinner, ProgressBar],
})
export class AppTicketMetrics {
    protected tickets!: Signal<Ticket[]>;
    protected ticketRevisions!: Signal<any>;
    protected ticketRevisionLoadPercentage!: Signal<number>;

    loading = signal<boolean>(false);

    ticketCount: Signal<number> = computed(() => {
        return this.tickets().length;
    });

    ticketMetrics: Signal<AppMetricMeta> = computed(() => this.getTicketsPerMonth());

    ticketsPerTeamMetrics: Signal<AppMetricMeta> = computed(() => this.getTicketsPerTeam());

    ticketsPerUserMetrics = signal({} as AppMetricMeta);

    constructor(private ticketService: TicketService, private ticketStore: TicketStore) {
        this.tickets = this.ticketStore.tickets;
        this.ticketRevisions = this.ticketStore.ticketRevisions;
        this.ticketRevisionLoadPercentage = this.ticketStore.ticketRevisionProcessingPercentage;

        this.ticketService.fetchTickets().then(() => {
            console.log('fetched tickets for metrics');
            this.loading.set(false);
        });

        effect(async () => {
            if (this.ticketRevisions()) {
                console.log('get user stats');
                const statsPerUser = await this.getTicketsPerUser();
                console.log(statsPerUser)
                this.ticketsPerUserMetrics.set(statsPerUser);
            } else console.log('boo hoo');
        });
    }

    getTicketsPerMonth(): AppMetricMeta {
        const labels: string[] = [];

        this.tickets().map((ticket) => {
            const yearMonth = `${ticket.created.getFullYear()}${String(
                ticket.created.getMonth() + 1
            ).padStart(2, '0')}`;

            if (!labels.includes(yearMonth)) labels.push(yearMonth);
        });
        labels.sort((a, b) => +a - +b);

        const data: number[] = labels.map((label) => {
            const tickets = this.tickets().filter((ticket) => {
                const yearMonth = `${ticket.created.getFullYear()}${String(
                    ticket.created.getMonth() + 1
                ).padStart(2, '0')}`;

                return yearMonth === label;
            });

            return tickets.length;
        });

        return { labels, data } as AppMetricMeta;
    }

    getTicketsPerTeam(): AppMetricMeta {
        const labels: string[] = [];

        this.tickets().map((ticket) => {
            const team = ticket.team;

            if (!labels.includes(team)) labels.push(team);
        });
        labels.sort((a, b) => +a - +b);

        const data: number[] = labels.map((label) => {
            const tickets = this.tickets().filter((ticket) => {
                return ticket.team === label;
            });

            return tickets.length;
        });

        return { labels, data } as AppMetricMeta;
    }

    getTicketsPerUser(): Promise<AppMetricMeta> {
        return new Promise((resolve) => {
            const labels: string[] = [];

            for (var ticket in this.ticketRevisions()) {

                this.ticketRevisions()[ticket].map((tickletRevisionForSingleTicket: Ticket) => {
                    const user = tickletRevisionForSingleTicket.user;

                    if (!user || user === 'Unknown') return;

                    if (!labels.includes(user)) labels.push(user);
                });
            }

            const data: number[] = labels.map((label) => {
                var tempUserCount = 0;
                for (var ticket in this.ticketRevisions()) {

                    this.ticketRevisions()[ticket].map((tickletRevisionForSingleTicket: Ticket) => {
                        const user = tickletRevisionForSingleTicket.user;
                        if (user === label) tempUserCount++;
                    });
                }
                return tempUserCount;
            });

            resolve({ labels, data } as AppMetricMeta);
        });
    }
}
