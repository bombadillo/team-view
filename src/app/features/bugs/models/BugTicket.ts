export interface BugTicket {
    id: string;
    title: string;
    description?: string;
    status: 'Committed' | 'Approved' | 'New' | 'Done' | 'InUAT' | 'Removed' | 'InTesting';
    priority?: 'low' | 'medium' | 'high' | 'critical';
    assignee?: string;
    team: string;
    created: Date;
    updated?: Date;
}
