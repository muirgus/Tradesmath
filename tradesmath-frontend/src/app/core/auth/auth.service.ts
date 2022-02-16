import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { Router } from '@angular/router';
import { appRolesInfo } from '@fuse/components/navigation';

@Injectable()
export class AuthService {
    public _authenticated: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService,
        private _route: Router
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any> {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string }): Observable<any> {
        // Throw error, if the user is already logged in
        if (this._authenticated) {
            return throwError('User is already logged in.');
        }

        return this._httpClient.post('api/auth/sign-in', credentials).pipe(
            switchMap((response: any) => {
                // Store the access token in the local storage
                this.accessToken = response.accessToken;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.user;

                // Return a new observable with the response
                return of(response);
            })
        );
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any> {
        // Renew token
        return this._httpClient
            .post('api/auth/refresh-access-token', {
                accessToken: this.accessToken,
            })
            .pipe(
                catchError(() =>
                    // Return false
                    of(false)
                ),
                switchMap((response: any) => {
                    // Store the access token in the local storage
                    this.accessToken = response.accessToken;

                    // Set the authenticated flag to true
                    this._authenticated = true;

                    // Store the user on the user service
                    this._userService.user = response.user;

                    // Return true
                    return of(true);
                })
            );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');

        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: {
        name: string;
        email: string;
        password: string;
        company: string;
    }): Observable<any> {
        return this._httpClient.post('api/auth/sign-up', user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: {
        email: string;
        password: string;
    }): Observable<any> {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(
        userType: string = null,
        redirectURL: string = null
    ): Observable<boolean> {
        // Check if the user is logged in
        if (this._authenticated) {
            if (
                AuthUtils.ignoreUrls().includes(this._route.url) &&
                AuthUtils.ignoreUrls().includes(window.location.pathname)
            ) {
                return of(true);
            }
            const userInfo = AuthUtils.getUserInfo();
            if (userInfo) {
                if (userType) {
                    const canAccessUser = userType.split(',');
                    if (
                        canAccessUser.includes(appRolesInfo.superAdmin) &&
                        userInfo.isSuperAdmin
                    ) {
                        return of(true);
                    }
                    if (
                        canAccessUser.includes(appRolesInfo.admin) &&
                        (userInfo.isAdmin || userInfo.isSuperAdmin)
                    ) {
                        return of(true);
                    }
                    if (
                        canAccessUser.includes(appRolesInfo.user) &&
                        !userInfo.isAdmin &&
                        !userInfo.isSuperAdmin
                    ) {
                        return of(true);
                    }
                    return of(false);
                }
                if (
                    redirectURL &&
                    (AuthUtils.getSuperAdminRoute().includes(redirectURL) ||
                        AuthUtils.getAdminRoute().includes(redirectURL))
                ) {
                    return of(true);
                }
                if (
                    userInfo.isSuperAdmin &&
                    (AuthUtils.getAdminRoute().includes(this._route.url) ||
                        AuthUtils.getSuperAdminRoute().includes(
                            this._route.url
                        ) ||
                        AuthUtils.getAdminRoute().includes(
                            window.location.pathname
                        ) ||
                        AuthUtils.getSuperAdminRoute().includes(
                            window.location.pathname
                        ))
                ) {
                    return of(true);
                }
                if (
                    redirectURL &&
                    AuthUtils.getAdminRoute().includes(redirectURL)
                ) {
                    return of(true);
                }
                if (
                    userInfo.isAdmin &&
                    (AuthUtils.getAdminRoute().includes(this._route.url) ||
                        AuthUtils.getAdminRoute().includes(
                            window.location.pathname
                        ))
                ) {
                    return of(true);
                }
                if (
                    redirectURL &&
                    AuthUtils.getUsersRoute().includes(redirectURL)
                ) {
                    return of(true);
                }
                if (
                    !userInfo.isAdmin &&
                    (AuthUtils.getUsersRoute().includes(this._route.url) ||
                        AuthUtils.getUsersRoute().includes(
                            window.location.pathname
                        ))
                ) {
                    return of(true);
                }
                return of(false);
            }
            return of(true);
        }

        // Check the access token availability
        if (!this.accessToken) {
            return of(false);
        }

        // Check the access token expire date
        if (AuthUtils.isTokenExpired(this.accessToken)) {
            return of(false);
        }

        // If the access token exists and it didn't expire, sign in using it
        return this.signInUsingToken();
    }
}
