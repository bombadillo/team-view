import { Routes } from '@angular/router';
import { AppPullRequests } from './routes/pull-requests/PullRequests';
import { AppBugs } from './routes/bugs/Bugs';

export const routes: Routes = [
    {
        path: '',
        component: AppBugs,
    },
    {
        path: 'pull-requests',
        component: AppPullRequests,
    },
];
