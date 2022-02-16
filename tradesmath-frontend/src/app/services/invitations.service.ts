import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    AngularFirestore,
    AngularFirestoreCollection,
    AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Invitations } from 'app/models/invitations';
import { environment } from 'environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class InvitationService {
    invitationsRef: AngularFirestoreCollection<Invitations>;
    private dbPath = '/invitations';

    constructor(private db: AngularFirestore, private _httpClient: HttpClient) {
        this.invitationsRef = db.collection(this.dbPath);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    createInvitation(payload: Invitations): Observable<any> {
        return this._httpClient.post('/api/invitations/create', payload);
    }

    checkInvitationInfo(invitationId: string): Observable<any> {
        return this._httpClient.get(
            `${environment.apiEndpoint}/api/invitations/get-invitation-by-id?invitationId=${invitationId}`
        );
    }

    updateInvitation(value: any): Observable<any> {
        return this._httpClient.post('/api/invitations/update', value);
    }
}
