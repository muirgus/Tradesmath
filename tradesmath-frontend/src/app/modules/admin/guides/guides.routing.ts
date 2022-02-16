import { Route } from '@angular/router';
import { GuidesComponent } from './guides.component';
import { LocalComponent } from './local/local.component';

export const guidesRoutes: Route[] = [
    {
        path: '',
        component: GuidesComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'getting-started',
            },
            {
                path: 'getting-started',
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        redirectTo: 'introduction',
                    },
                    {
                        path: 'introduction',
                        component: LocalComponent,
                    },
                ],
            },
        ],
    },
];
