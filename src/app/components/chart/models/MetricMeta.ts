interface AppMetricMeta {
    labels: string[];
    dataSets: AppMetric[] | undefined;
    data: number[] | undefined;
}
