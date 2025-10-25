import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, effect, inject, input, PLATFORM_ID } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
    selector: 'app-bar-chart',
    templateUrl: './bar-chart.html',
    standalone: true,
    imports: [ChartModule, ProgressSpinner],
})
export class AppBarChart {
    metrics = input.required<AppMetricMeta>();

    basicData: any;

    basicOptions: any;

    platformId = inject(PLATFORM_ID);

    constructor(private cd: ChangeDetectorRef) {
        console.log(this.metrics);

        effect(() => {
            const metrics = this.metrics();
            if (metrics) this.initChart(metrics);
        });
    }

    initChart(metrics: AppMetricMeta) {
        if (isPlatformBrowser(this.platformId)) {
            const documentStyle = getComputedStyle(document.documentElement);
            const textColor = documentStyle.getPropertyValue('--p-text-color');
            const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
            const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

            this.basicData = {
                labels: metrics.labels,
                datasets: [
                    {
                        // data: [540, 325, 702, 620],
                        data: metrics.data,
                        backgroundColor: [
                            'rgba(249, 115, 22, 0.2)',
                            'rgba(6, 182, 212, 0.2)',
                            'rgb(107, 114, 128, 0.2)',
                            'rgba(139, 92, 246, 0.2)',
                        ],
                        borderColor: [
                            'rgb(249, 115, 22)',
                            'rgb(6, 182, 212)',
                            'rgb(107, 114, 128)',
                            'rgb(139, 92, 246)',
                        ],
                        borderWidth: 1,
                    },
                ],
            };

            this.basicOptions = {
                plugins: {
                    legend: {
                        display: false,
                    },
                },
                scales: {
                    x: {
                        ticks: {
                            color: textColorSecondary,
                        },
                        grid: {
                            color: surfaceBorder,
                        },
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: textColorSecondary,
                        },
                        grid: {
                            color: surfaceBorder,
                        },
                    },
                },
            };
            this.cd.markForCheck();
        }
    }
}
