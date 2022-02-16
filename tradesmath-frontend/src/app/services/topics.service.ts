import { Injectable } from '@angular/core';
import { Topics } from 'app/models/topics';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class TopicService {
    constructor(private _httpClient: HttpClient) {}

    createTopic(topic: Topics): Observable<any> {
        return this._httpClient.post('/api/topics/create', topic);
    }

    getAllTopicsList(): Observable<any> {
        return this._httpClient.get('/api/topics/get');
    }

    getStudentTopics(): Observable<any> {
        return this._httpClient.get('/api/topics/student-topics');
    }

    lastAnswer(): Observable<any> {
        return this._httpClient.get('/api/questions/last-question');
    }

    getAllTopicsListByKey(key: string): Observable<any> {
        return this._httpClient.get(
            '/api/topics/get-topic-by-id?topicId=' + key
        );
    }

    updateTopic(value: any): Observable<any> {
        return this._httpClient.post('/api/topics/update', value);
    }

    deleteTopic(key: string): Observable<any> {
        return this._httpClient.delete('/api/topics/delete?topicId=' + key);
    }
}
