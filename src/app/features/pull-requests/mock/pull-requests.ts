import { PullRequest, Repository, User } from '../models/PullRequest';

// Seed a few realistic pull requests
const seed: PullRequest[] = [
    {
        repository: {
            id: 'repo-001',
            name: 'team-view-frontend',
            url: 'https://dev.azure.com/org/project/_git/team-view-frontend',
        },
        pullRequestId: 1001,
        status: 'completed',
        createdBy: {
            displayName: 'Sarah Chen',
            url: 'https://dev.azure.com/org/_users/1',
            id: 'user-001',
            uniqueName: 'sarah.chen@company.com',
            imageUrl: 'https://dev.azure.com/org/_users/1/avatar',
        },
        creationDate: '2025-10-20T10:15:00Z',
        closedDate: '2025-10-21T12:00:00Z',
        title: 'feat: add responsive login page',
        sourceRefName: 'refs/heads/feature/login-responsive',
        targetRefName: 'refs/heads/main',
        isDraft: false,
        url: 'https://dev.azure.com/org/project/_git/team-view-frontend/pullrequest/1001',
    },
    {
        repository: {
            id: 'repo-002',
            name: 'team-view-backend',
            url: 'https://dev.azure.com/org/project/_git/team-view-backend',
        },
        pullRequestId: 1002,
        status: 'active',
        createdBy: {
            displayName: 'John Smith',
            url: 'https://dev.azure.com/org/_users/2',
            id: 'user-002',
            uniqueName: 'john.smith@company.com',
            imageUrl: 'https://dev.azure.com/org/_users/2/avatar',
        },
        creationDate: '2025-10-22T09:00:00Z',
        closedDate: '',
        title: 'fix: memory leak in dashboard',
        sourceRefName: 'refs/heads/bugfix/dashboard-memory-leak',
        targetRefName: 'refs/heads/main',
        isDraft: false,
        url: 'https://dev.azure.com/org/project/_git/team-view-backend/pullrequest/1002',
    },
    {
        repository: {
            id: 'repo-003',
            name: 'team-view-api',
            url: 'https://dev.azure.com/org/project/_git/team-view-api',
        },
        pullRequestId: 1003,
        status: 'abandoned',
        createdBy: {
            displayName: 'Emily Davis',
            url: 'https://dev.azure.com/org/_users/3',
            id: 'user-003',
            uniqueName: 'emily.davis@company.com',
            imageUrl: 'https://dev.azure.com/org/_users/3/avatar',
        },
        creationDate: '2025-10-18T14:30:00Z',
        closedDate: '2025-10-19T08:00:00Z',
        title: 'chore: update dependencies',
        sourceRefName: 'refs/heads/chore/update-deps',
        targetRefName: 'refs/heads/main',
        isDraft: true,
        url: 'https://dev.azure.com/org/project/_git/team-view-api/pullrequest/1003',
    },
];

// Mock data sources
const repoNames = [
    'team-view-frontend',
    'team-view-backend',
    'team-view-api',
    'team-view-utils',
    'team-view-docs',
];
const userNames = [
    { displayName: 'Sarah Chen', uniqueName: 'sarah.chen@company.com' },
    { displayName: 'John Smith', uniqueName: 'john.smith@company.com' },
    { displayName: 'Emily Davis', uniqueName: 'emily.davis@company.com' },
    { displayName: 'Alex Wong', uniqueName: 'alex.wong@company.com' },
    { displayName: 'Priya Patel', uniqueName: 'priya.patel@company.com' },
];
const statuses: PullRequest['status'][] = ['active', 'completed', 'abandoned'];
const refPrefixes = ['feature', 'bugfix', 'chore', 'hotfix', 'docs'];

function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDateWithinDays(daysBack: number) {
    const now = Date.now();
    const delta = randomInt(0, daysBack) * 24 * 60 * 60 * 1000;
    return new Date(now - delta);
}

function makeRepository(idx: number): Repository {
    return {
        id: `repo-${(idx % repoNames.length) + 1}`,
        name: repoNames[idx % repoNames.length],
        url: `https://dev.azure.com/org/project/_git/${repoNames[idx % repoNames.length]}`,
    };
}

function makeUser(idx: number): User {
    const user = userNames[idx % userNames.length];
    return {
        displayName: user.displayName,
        url: `https://dev.azure.com/org/_users/${idx + 1}`,
        id: `user-${(idx % userNames.length) + 1}`,
        uniqueName: user.uniqueName,
        imageUrl: `https://dev.azure.com/org/_users/${idx + 1}/avatar`,
    };
}

const generated: PullRequest[] = [];
for (let i = seed.length + 1; i <= 50; i++) {
    const repoIdx = i % repoNames.length;
    const userIdx = i % userNames.length;
    const status = statuses[i % statuses.length];
    const isDraft = i % 7 === 0;
    const created = randomDateWithinDays(60);
    const closed = status === 'completed' || status === 'abandoned'
        ? new Date(created.getTime() + randomInt(1, 5) * 24 * 60 * 60 * 1000).toISOString()
        : '';
    const prId = 1000 + i;
    const refType = refPrefixes[i % refPrefixes.length];
    const branchName = `${refType}/auto-${prId}`;
    generated.push({
        repository: makeRepository(repoIdx),
        pullRequestId: prId,
        status,
        createdBy: makeUser(userIdx),
        creationDate: created.toISOString(),
        closedDate: closed,
        title: `${refType}: auto-generated PR #${prId}`,
        sourceRefName: `refs/heads/${branchName}`,
        targetRefName: 'refs/heads/main',
        isDraft,
        url: `https://dev.azure.com/org/project/_git/${repoNames[repoIdx]}/pullrequest/${prId}`,
    });
}

export const mockPullRequests: PullRequest[] = [...seed, ...generated];