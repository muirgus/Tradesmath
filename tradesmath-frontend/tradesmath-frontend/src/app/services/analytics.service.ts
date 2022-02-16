import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AnalyticsService {
    constructor(private _httpClient: HttpClient) {}

    saveAnalytics(payload: any): void {
        this._httpClient
            .post('/api/analytics/save-analytics', payload)
            .subscribe((res) => {});
    }

    getAnalytics(): Observable<any> {
        return this._httpClient.get('/api/analytics/get');
    }

    getTopWrongAnswers(): Observable<any> {
        return this._httpClient.get('/api/analytics/top-wrong-answers');
    }

    getQuestionsBetween(payload: any): Observable<any> {
        return this._httpClient.post(
            '/api/analytics/get-question-analytics',
            payload
        );
    }
}
