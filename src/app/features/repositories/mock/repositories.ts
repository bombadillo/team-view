import { Repository } from '../models/Repository';

// Seed a few realistic repositories
const seed: Repository[] = [
    {
        id: 'repo-001',
        name: 'team-view-frontend',
        url: 'https://dev.azure.com/org/project/_git/team-view-frontend',
        defaultBranch: 'refs/heads/main',
        size: 12000,
        remoteUrl: 'https://dev.azure.com/org/project/_git/team-view-frontend',
        sshUrl: 'git@ssh.dev.azure.com:v3/org/project/team-view-frontend',
        webUrl: 'https://dev.azure.com/org/project/_git/team-view-frontend',
        isDisabled: false,
        isInMaintenance: false,
        owners: []
    },
    {
        id: 'repo-002',
        name: 'team-view-backend',
        url: 'https://dev.azure.com/org/project/_git/team-view-backend',
        defaultBranch: 'refs/heads/main',
        size: 15000,
        remoteUrl: 'https://dev.azure.com/org/project/_git/team-view-backend',
        sshUrl: 'git@ssh.dev.azure.com:v3/org/project/team-view-backend',
        webUrl: 'https://dev.azure.com/org/project/_git/team-view-backend',
        isDisabled: false,
        isInMaintenance: false,
        owners: []
    },
    {
        id: 'repo-003',
        name: 'team-view-api',
        url: 'https://dev.azure.com/org/project/_git/team-view-api',
        defaultBranch: 'refs/heads/main',
        size: 9000,
        remoteUrl: 'https://dev.azure.com/org/project/_git/team-view-api',
        sshUrl: 'git@ssh.dev.azure.com:v3/org/project/team-view-api',
        webUrl: 'https://dev.azure.com/org/project/_git/team-view-api',
        isDisabled: false,
        isInMaintenance: false,
        owners: []
    },
];

const repoNames = [
    'team-view-frontend',
    'team-view-backend',
    'team-view-api',
    'team-view-utils',
    'team-view-docs',
    'team-view-analytics',
    'team-view-mobile',
    'team-view-desktop',
    'team-view-legacy',
    'team-view-qa',
    'team-view-devops',
    'team-view-security',
    'team-view-ml',
    'team-view-data',
    'team-view-ux',
    'team-view-admin',
    'team-view-api-v2',
    'team-view-portal',
    'team-view-monitor',
    'team-view-support',
    'team-view-hr',
    'team-view-legal',
    'team-view-sales',
    'team-view-marketing',
];

function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const generated: Repository[] = [];
const usedIds = new Set(seed.map(r => r.id));
const usedNames = new Set(seed.map(r => r.name));
let genCount = 0;
const totalRepos = 20;
for (let i = seed.length + 1; genCount < totalRepos && i <= 100; i++) {
    // Generate a unique ID
    let uniqueId;
    let attempt = 0;
    do {
        uniqueId = `repo-${i}`;
        attempt++;
    } while (usedIds.has(uniqueId) && attempt < 100);
    usedIds.add(uniqueId);

    // Find an unused repo name
    let repoName = repoNames.find(name => !usedNames.has(name));
    if (!repoName) {
        // If we run out of names, generate a new unique name
        repoName = `team-view-extra-${i}`;
    }
    usedNames.add(repoName);

    generated.push({
        id: uniqueId,
        name: repoName,
        url: `https://dev.azure.com/org/project/_git/${repoName}`,
        defaultBranch: 'refs/heads/main',
        size: randomInt(5000, 20000),
        remoteUrl: `https://dev.azure.com/org/project/_git/${repoName}`,
        sshUrl: `git@ssh.dev.azure.com:v3/org/project/${repoName}`,
        webUrl: `https://dev.azure.com/org/project/_git/${repoName}`,
        isDisabled: i % 10 === 0,
        isInMaintenance: i % 15 === 0,
        owners: []
    });
    genCount++;
}

export const mockRepositories: Repository[] = [...seed, ...generated];
