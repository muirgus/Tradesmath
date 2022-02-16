import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';
import {TopicsComponent} from './topics/topics.component';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatChipsModule} from '@angular/material/chips';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDividerModule} from '@angular/material/divider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import {SharedModule} from 'app/shared/shared.module';
import {QuestionsComponent} from './questions/questions.component';
import {ListTopicsComponent} from './list-topics/list-topics.component';
import {ListQuestionsComponent} from './list-questions/list-questions.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {InvitationComponent} from './invitations/invitations.component';
import {appRolesInfo} from '@fuse/components/navigation';
import {UsersComponent} from './users/users.component';
import {UsersDetailsComponent} from './users-details/users-details.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSortModule} from '@angular/material/sort';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {QuestionTemplatesComponent} from './question-templates/question-templates.component';
import {MathModule} from '../math/math.module';
import {MatStepperModule} from '@angular/material/stepper';
import {DashboardComponent} from './dashboard/dashboard.component';
import {HighchartsChartModule} from 'highcharts-angular';
import {ProfileComponent} from '../student/profile/profile.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

const exampleRoutes: Route[] = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
    },
    {
        path: 'topics',
        component: TopicsComponent,
        data: {
            userType: `${
                appRolesInfo.admin
            },${
                appRolesInfo.superAdmin
            }`
        }
    },
    {
        path: 'view-topics',
        component: ListTopicsComponent,
        data: {
            userType: `${
                appRolesInfo.admin
            },${
                appRolesInfo.superAdmin
            }`
        }
    },
    {
        path: 'questions',
        component: QuestionsComponent,
        data: {
            userType: `${
                appRolesInfo.admin
            },${
                appRolesInfo.superAdmin
            }`
        }
    }, {
        path: 'view-questions',
        component: ListQuestionsComponent,
        data: {
            userType: `${
                appRolesInfo.admin
            },${
                appRolesInfo.superAdmin
            }`
        }
    }, {
        path: 'question-templates',
        component: QuestionTemplatesComponent,
        data: {
            userType: `${
                appRolesInfo.admin
            },${
                appRolesInfo.superAdmin
            }`
        }
    }, {
        path: 'generate-invitation',
        component: InvitationComponent,
        data: {
            userType: `${
                appRolesInfo.superAdmin
            }`
        }
    }, {
        path: 'users',
        component: UsersComponent,
        data: {
            userType: `${
                appRolesInfo.superAdmin
            }`
        }
    }, {
        path: 'users-details',
        component: UsersDetailsComponent,
        data: {
            userType: `${
                appRolesInfo.superAdmin
            }`
        }
    }, {
        path: 'topics',
        component: TopicsComponent,
        data: {
            userType: `${
                appRolesInfo.admin
            },${
                appRolesInfo.superAdmin
            }`
        }
    }, {
        path: 'dashboard',
        component: DashboardComponent,
        data: {
            userType: `${
                appRolesInfo.admin
            },${
                appRolesInfo.superAdmin
            }`
        }
    }, {
        path: 'profile',
        component: ProfileComponent,
        data: {
            userType: `${
                appRolesInfo.admin
            },${
                appRolesInfo.superAdmin
            }`


        }
    },
];

@NgModule({
    declarations: [
        TopicsComponent,
        QuestionsComponent,
        ListTopicsComponent,
        ListQuestionsComponent,
        InvitationComponent,
        UsersComponent,
        UsersDetailsComponent,
        QuestionTemplatesComponent,
        DashboardComponent,
    ],
    imports: [
        RouterModule.forChild(exampleRoutes),
        MatButtonModule,
        MatButtonToggleModule,
        MatChipsModule,
        MatDatepickerModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatMomentDateModule,
        MatSelectModule,
        MatTableModule,
        SharedModule,
        MatExpansionModule,
        MatCheckboxModule,
        MatSortModule,
        MatProgressSpinnerModule,
        MatStepperModule,
        MathModule,
        HighchartsChartModule,
        MatSlideToggleModule,
    ]
})
export class AdminModule {}
