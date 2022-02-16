import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiPrefixInterceptor } from 'app/interceptors/api-prefix.interceptor';
import { FilterComponent } from './filter/filter.component';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { SafePipe } from './pipes/safe.pipes';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatInputModule,
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FilterComponent,
        SafePipe,
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ApiPrefixInterceptor,
            multi: true,
        },
    ],
    declarations: [FilterComponent, SafePipe],
})
export class SharedModule {}
