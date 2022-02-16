import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
} from '@angular/common/http';

import { Observable } from 'rxjs/internal/Observable';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { environment } from 'environments/environment';

/**
 * Prefixes all requests with `environment.apiEndpoint`.
 */
@Injectable({
    providedIn: 'root',
})
export class ApiPrefixInterceptor implements HttpInterceptor {
    constructor(private route: Router) {}

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        if (
            !/^(http|https):/i.test(request.url) &&
            (request.url.includes('api/') || request.url.includes('/api/'))
        ) {
            if (
                !localStorage.getItem('info') ||
                !localStorage.getItem('accessToken')
            ) {
                this.route.navigate(['/sign-in']);
            } else {
                request = request.clone({
                    url: environment.apiEndpoint + request.url,
                    setHeaders: {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        Authorization: `Bearer ${localStorage.getItem(
                            'accessToken'
                        )}`,
                    },
                });
                return next.handle(request).pipe(
                    catchError((error) => {
                        if (error.status === 401 || error.status === 403) {
                            // show alerts and required actions tobe done
                            this.route.navigate(['/sign-in']);
                            return throwError(error.statusText);
                        }
                        return throwError(error.statusText);
                    })
                );
            }
        }
        return next.handle(request);
    }
}
