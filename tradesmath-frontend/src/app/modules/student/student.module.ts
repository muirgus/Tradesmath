import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';
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
import {MatExpansionModule} from '@angular/material/expansion';
import {MatStepperModule} from '@angular/material/stepper';
import {appRolesInfo} from '@fuse/components/navigation';
import {StudentTopicsComponent} from './student-topics/student-topics.component';
import {StudentQuestionsComponent} from './student-questions/student-questions.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MathModule} from '../math/math.module';
import {StudentScoreComponent} from './student-score/student-score.component';
import {NgCircleProgressModule} from 'ng-circle-progress';
import {ProfileComponent} from './profile/profile.component';
import {StudentAssessmentComponent} from './student-assessment/student-assessment.component';

const exampleRoutes: Route[] = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'topic-detail',
    },
    {
        path: 'topics',
        component: StudentTopicsComponent,
        data: {
            userType: `${appRolesInfo.user}`,
        },
    },
    {
        path: 'topic-detail',
        component: StudentAssessmentComponent,
        data: {
            userType: `${appRolesInfo.user}`,
        },
    },
    {
        path: 'questions',
        component: StudentQuestionsComponent,
        data: {
            userType: `${appRolesInfo.user}`,
        },
    },
    {
        path: 'profile',
        component: ProfileComponent,
        data: {
            userType: `${appRolesInfo.user}`,
        },
    },
];

@NgModule({
    declarations: [
        StudentTopicsComponent,
        StudentQuestionsComponent,
        StudentScoreComponent,
        ProfileComponent,
        StudentAssessmentComponent,
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
        MatStepperModule,
        MatTableModule,
        SharedModule,
        MatExpansionModule,
        MatProgressBarModule,
        MathModule,
        NgCircleProgressModule.forRoot(
            {
                radius: 100,
                outerStrokeWidth: 16,
                innerStrokeWidth: 8,
                outerStrokeColor: '#78C000',
                innerStrokeColor: '#C7E596',
                animationDuration: 300
            }
        ),
    ]
})
export class StudentModule {}
