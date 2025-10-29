import { PullRequest } from "../../models/PullRequest";

export interface PullRequestPort {
    getPullRequests(): Promise<PullRequest[]>;
}