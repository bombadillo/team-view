import { Component, OnInit, ChangeDetectorRef, effect, input } from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
    selector: 'app-polar-chart',
    templateUrl: './polar-chart.html',
    standalone: true,
    imports: [ChartModule],
})
export class AppPolarChart {
    metrics = input.required<AppMetricMeta>();

    data: any;

    options: any;

    constructor(private cd: ChangeDetectorRef) {
        effect(() => {
            const metrics = this.metrics();
            if (metrics) this.initChart(metrics);
        });
    }

    initChart(metrics: AppMetricMeta) {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--p-text-color');
        const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

        this.data = {
            datasets: [
                {
                    data: metrics.data,
                    backgroundColor: [
                        documentStyle.getPropertyValue('--p-pink-500'),
                        documentStyle.getPropertyValue('--p-gray-500'),
                        documentStyle.getPropertyValue('--p-orange-500'),
                        documentStyle.getPropertyValue('--p-purple-500'),
                        documentStyle.getPropertyValue('--p-cyan-500'),
                    ],
                },
            ],
            labels: metrics.labels,
        };

        this.options = {
            plugins: {
                legend: {
                    labels: {
                        color: '#000000',
                    },
                    onClick: () => {},
                },
            },
            scales: {
                r: {
                    grid: {
                        color: surfaceBorder,
                    },
                },
            },
            circular: false,
        };
        this.cd.markForCheck();
    }
}
