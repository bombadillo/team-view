import { Routes } from '@angular/router';
import { AppPullRequests } from './routes/pull-requests/PullRequests';
import { AppBugs } from './routes/bugs/Bugs';
import { AppTickets } from './routes/tickets/Tickets';
import { AppCode } from './routes/code/Code';

export const routes: Routes = [
    {
        path: '',
        component: AppBugs,
    },
    {
        path: 'pull-requests',
        component: AppPullRequests,
    },
    {
        path: 'tickets',
        component: AppTickets,
    },
    {
        path: 'code',
        component: AppCode,
    },
];
