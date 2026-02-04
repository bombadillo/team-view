export interface AzureDevOpsRepositoryResponse {
    value: AzureDevOpsRepository[];
}

export interface AzureDevOpsRepository {
    id: string;
    name: string;
    url: string;
    defaultBranch: string;
    size: number;
    remoteUrl: string;
    sshUrl: string;
    webUrl: string;
    isDisabled: boolean;
    isInMaintenance: boolean;
}
