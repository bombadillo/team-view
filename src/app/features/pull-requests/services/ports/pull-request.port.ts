import { PullRequest } from "../../models/PullRequest";

export interface PullRequestPort {
    getPullRequests(force: boolean): Promise<PullRequest[]>;
}