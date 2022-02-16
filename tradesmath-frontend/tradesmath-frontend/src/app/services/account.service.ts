import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    AngularFirestore,
    AngularFirestoreCollection,
    AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Users } from 'app/models/users';
import { environment } from 'environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AccountService {
    constructor(private _httpClient: HttpClient) {}

    getUsersList(): Observable<any> {
        return this._httpClient.get('/api/account/get-all-users');
    }

    signIn(payload: any): Observable<any> {
        return this._httpClient.post(
            `${environment.apiEndpoint}/api/account/login`,
            payload
        );
    }

    signUp(payload: any): Observable<any> {
        return this._httpClient.post(
            `${environment.apiEndpoint}/api/account/register`,
            payload
        );
    }

    activateAccount(payload: any): Observable<any> {
        return this._httpClient.post(
            `${environment.apiEndpoint}/api/account/activate-account`,
            payload
        );
    }

    checkUserInfoByKey(key: string): Observable<any> {
        return this._httpClient.get(
            '/api/account/get-user-by-id?userId=' + key
        );
    }

    updateUsers(value: any): Observable<any> {
        return this._httpClient.post(
            `${environment.apiEndpoint}/api/account/update-profile`,
            value
        );
    }

    deleteUsers(key: string): Observable<any> {
        return this._httpClient.delete(
            '/api/account/delete-user-by-id?userId=' + key
        );
    }
    forgetPassword(email: any): Observable<any> {
        return this._httpClient.post(
            `${environment.apiEndpoint}/api/account/forget-password`,
            email
        );
    }
    resetPassword(value: any): Observable<any> {
        return this._httpClient.post(
            `${environment.apiEndpoint}/api/account/verify-otp `,
            value
        );
    }
}
