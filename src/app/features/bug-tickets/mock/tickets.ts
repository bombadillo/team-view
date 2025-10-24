export interface BugTicket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee: string;
  created: Date;
  updated: Date;
}

export const mockTickets: BugTicket[] = [
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
