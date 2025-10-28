export interface AzureDevOpsWorkItem {
    WorkItemId: number;
    AreaSK: string;
    CreatedDateSK: number;
    Title: string;
    WorkItemType: string;
    CreatedDate: string;
    State: string;
    FoundIn: string | null;
}