import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    AngularFirestore,
    AngularFirestoreCollection,
    AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Questions } from 'app/models/questions';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class QuestionsService {
    constructor(private _httpClient: HttpClient) {}

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    createQuestion(question: any): Observable<any> {
        return this._httpClient.post('/api/questions/create', question);
    }

    getQuestionsList(): Observable<any> {
        return this._httpClient.get('/api/questions/get');
    }

    getQuestionsListByKey(key: string): Observable<any> {
        return this._httpClient.get(
            `/api/questions/get-questions?questionId=${key}`
        );
    }

    getQuestionsByTopic(topicId: string): Observable<any> {
        return this._httpClient.get(
            `/api/questions/get-questions-by-id?topicId=${topicId}`
        );
    }

    updateQuestions(value: any): Observable<any> {
        return this._httpClient.post('/api/questions/update', value);
    }

    deleteQuestions(key: string): Observable<any> {
        return this._httpClient.delete('/api/questions/delete?questionId=' + key);
    }
}
