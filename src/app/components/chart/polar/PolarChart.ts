import { Component, OnInit, ChangeDetectorRef, effect } from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
    selector: 'app-polar-chart',
    templateUrl: './polar-chart.html',
    standalone: true,
    imports: [ChartModule],
})
export class AppPolarChart implements OnInit {
    data: any;

    options: any;

    constructor(private cd: ChangeDetectorRef) {}

    themeEffect = effect(() => {
        this.initChart();
    });

    ngOnInit() {
        this.initChart();
    }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--p-text-color');
        const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

        this.data = {
            datasets: [
                {
                    data: [11, 16, 7, 3, 14],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--p-pink-500'),
                        documentStyle.getPropertyValue('--p-gray-500'),
                        documentStyle.getPropertyValue('--p-orange-500'),
                        documentStyle.getPropertyValue('--p-purple-500'),
                        documentStyle.getPropertyValue('--p-cyan-500'),
                    ],
                    label: 'My dataset',
                },
            ],
            labels: ['Pink', 'Gray', 'Orange', 'Purple', 'Cyan'],
        };

        this.options = {
            plugins: {
                legend: {
                    labels: {
                        color: '#000000',
                    },
                },
            },
            scales: {
                r: {
                    grid: {
                        color: surfaceBorder,
                    },
                },
            },
        };
        this.cd.markForCheck();
    }
}
