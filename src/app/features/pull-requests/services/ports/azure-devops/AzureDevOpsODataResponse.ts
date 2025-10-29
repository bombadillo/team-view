export interface AzureDevOpsODataResponse {
    value: AzureDevOpsPullRequest[]
}

export interface AzureDevOpsPullRequest {
    repository: AzureDevOpsRepository;
    pullRequestId: number;
    status: string;
    createdBy: AzureDevOpsUser;
    creationDate: string;
    closedDate: string;
    title: string;
    sourceRefName: string;
    targetRefName: string;
    isDraft: boolean;
    url: string;
}

export interface AzureDevOpsRepository {
    id: string;
    name: string;
    url: string;
}

export interface AzureDevOpsUser {
    displayName: string;
    url: string;
    id: string;
    uniqueName: string;
    imageUrl: string;
}