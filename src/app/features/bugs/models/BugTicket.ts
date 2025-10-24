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
