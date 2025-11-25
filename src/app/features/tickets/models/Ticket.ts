export interface Ticket {
    id: string;
    title: string;
    description?: string;
    status: 'Committed' | 'Approved' | 'New' | 'Done' | 'InUAT' | 'Removed' | 'InTesting';
    priority?: 'low' | 'medium' | 'high' | 'critical';
    // Maybe remove this since we map the user? This is the UserSK
    assignee: string;
    user: string;
    team: string;
    created: Date;
    updated?: Date;
    revisions?: Ticket[]
}
