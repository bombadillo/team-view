export interface PullRequest {
    repository: Repository;
    pullRequestId: number;
    status: string;
    createdBy: User;
    creationDate: string;
    closedDate: string;
    title: string;
    sourceRefName: string;
    targetRefName: string;
    isDraft: boolean;
    url: string;
}

export interface Repository {
    id: string;
    name: string;
    url: string;
}

export interface User {
    displayName: string;
    url: string;
    id: string;
    uniqueName: string;
    imageUrl: string;
}