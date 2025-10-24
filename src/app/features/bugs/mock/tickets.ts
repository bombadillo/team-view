import { BugTicket } from '../models/BugTicket';

// Seed a few realistic tickets and then generate additional ones to reach 100
const seed: BugTicket[] = [
    {
        id: 'BUG-001',
        title: 'Login page not responsive on mobile devices',
        description: 'The login form elements overlap on screens smaller than 375px width',
        status: 'open',
        priority: 'high',
        assignee: 'Sarah Chen',
        created: new Date('2025-10-22'),
        updated: new Date('2025-10-23'),
    },
    {
        id: 'BUG-002',
        title: 'Memory leak in dashboard component',
        description: 'Memory usage increases significantly after switching between dashboard tabs',
        status: 'in-progress',
        priority: 'critical',
        assignee: 'John Smith',
        created: new Date('2025-10-21'),
        updated: new Date('2025-10-24'),
    },
    {
        id: 'BUG-003',
        title: 'Incorrect date format in export',
        description: 'CSV exports show dates in US format instead of ISO format',
        status: 'closed',
        priority: 'medium',
        assignee: 'Mike Johnson',
        created: new Date('2025-10-20'),
        updated: new Date('2025-10-22'),
    },
    {
        id: 'BUG-004',
        title: 'API timeout on large datasets',
        description: 'Server returns 504 when fetching more than 1000 records',
        status: 'open',
        priority: 'high',
        assignee: 'Emily Davis',
        created: new Date('2025-10-23'),
        updated: new Date('2025-10-24'),
    },
    {
        id: 'BUG-005',
        title: 'Dark mode color contrast issues',
        description: 'Several UI elements have insufficient contrast ratio in dark mode',
        status: 'in-progress',
        priority: 'low',
        assignee: 'Alex Wong',
        created: new Date('2025-10-22'),
        updated: new Date('2025-10-23'),
    },
];

const statuses: BugTicket['status'][] = ['open', 'in-progress', 'closed'];
const priorities: BugTicket['priority'][] = ['low', 'medium', 'high', 'critical'];
const assignees = [
    'Sarah Chen',
    'John Smith',
    'Mike Johnson',
    'Emily Davis',
    'Alex Wong',
    'Priya Patel',
    'Carlos Ruiz',
    'Anna Müller',
    'Chen Wei',
    'Fatima Al-Sayed',
];

const lorem = [
    'Unexpected exception thrown when saving user settings.',
    'UI freezes for several seconds after clicking the Save button.',
    'Error message lacks useful information for debugging.',
    'Pagination controls are non-functional on filtered views.',
    'Translations missing for several UI strings in French locale.',
    'File upload fails silently when file size is just under the limit.',
    'Search results return duplicates for recent queries.',
    'Notifications are not marked as read after opening them.',
    'Charts show incorrect totals when filters are applied.',
    'Permissions check allows unauthenticated access to endpoint.',
];

function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDateWithinDays(daysBack: number) {
    const now = Date.now();
    const delta = randomInt(0, daysBack) * 24 * 60 * 60 * 1000;
    return new Date(now - delta);
}

const generated: BugTicket[] = [];
for (let i = seed.length + 1; i <= 100; i++) {
    const id = `BUG-${String(i).padStart(3, '0')}`;
    const title = `Auto-generated: ${lorem[(i - 1) % lorem.length]}`;
    const description = lorem[(i - 1) % lorem.length] + ' (auto-generated ticket)';
    const status = statuses[i % statuses.length];
    const priority = priorities[i % priorities.length];
    const assignee = assignees[i % assignees.length];
    const created = randomDateWithinDays(30);
    // updated is after created by up to 5 days
    const updated = new Date(created.getTime() + randomInt(0, 5) * 24 * 60 * 60 * 1000);

    generated.push({
        id,
        title,
        description,
        status,
        priority,
        assignee,
        created,
        updated,
    });
}

export const mockTickets: BugTicket[] = [...seed, ...generated];
