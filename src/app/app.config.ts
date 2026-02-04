import {
    ApplicationConfig,
    provideBrowserGlobalErrorListeners,
    provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZonelessChangeDetection(),
        provideRouter(routes),
        provideHttpClient(),
        providePrimeNG({
            theme: {
                preset: Aura,
            },
        }),
        {
            provide: 'DEVOPS_CONFIG',
            useValue: {
                org: '',
                project: '',
                pat: '',
                analyticsPat: '',
            },
        },
        { provide: 'MOCK_DATA', useValue: false },
    ],
};
