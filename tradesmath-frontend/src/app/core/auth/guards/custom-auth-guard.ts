import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { appRolesInfo } from '@fuse/components/navigation';
import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from '../auth.service';
import { AuthUtils } from '../auth.utils';

@Injectable({
    providedIn: 'root',
})
export class CustomAuthGuard implements CanActivate {
    constructor(private _authService: AuthService, private _router: Router) {}

    /**
     * Can activate
     *
     * @param route
     * @param state
     */
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        if (AuthUtils.ignoreUrls().includes(state.url)) {
            return of(true);
        }
        const redirectUrl =
            state.url === '/sign-out' || state.url === '/'
                ? '/sign-in'
                : state.url;
        let userType = route.data.userType;
        const userInfo = AuthUtils.getUserInfo();
        if (userInfo) {
            this._authService._authenticated = true;
            if (!userType) {
                if (userInfo.isSuperAdmin) {
                    userType = `${appRolesInfo.admin},${appRolesInfo.superAdmin}`;
                }
                if (userInfo.isAdmin && !userType) {
                    userType = `${appRolesInfo.admin}`;
                }
                if (!userInfo.isAdmin && !userType) {
                    userType = `${appRolesInfo.user}`;
                }
            }
        }
        if (userType && this._authService._authenticated && userInfo) {
            if (userType) {
                const canAccessUser = userType.split(',');
                if (
                    userInfo.isSuperAdmin &&
                    redirectUrl &&
                    (AuthUtils.getSuperAdminRoute().includes(redirectUrl) ||
                        AuthUtils.getAdminRoute().includes(redirectUrl) ||
                        redirectUrl.includes('/app/users-details') ||
                        redirectUrl.includes('/app/view-questions') ||
                        redirectUrl.includes('/app/questions'))
                ) {
                    return of(true);
                }
                if (
                    (userInfo.isSuperAdmin || userInfo.isAdmin) &&
                    redirectUrl &&
                    (AuthUtils.getAdminRoute().includes(redirectUrl) ||
                        redirectUrl.includes('/app/view-questions') ||
                        redirectUrl.includes('/app/questions'))
                ) {
                    return of(true);
                }
                if (
                    !userInfo.isAdmin &&
                    !userInfo.isSuperAdmin &&
                    redirectUrl &&
                    (AuthUtils.getUsersRoute().includes(redirectUrl) ||
                        redirectUrl.includes('/student/questions') ||
                        redirectUrl.includes('/student/topic-detail'))
                ) {
                    return of(true);
                }
            }
        }
        this._router.navigate(['/sign-in']);
        return of(false);
    }
}
