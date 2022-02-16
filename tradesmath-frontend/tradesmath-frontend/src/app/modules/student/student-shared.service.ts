import { Injectable } from '@angular/core';
import { Topics } from 'app/models/topics';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class StudentSharedService {
    private topicsList = new BehaviorSubject<any>([] as any);
    // eslint-disable-next-line @typescript-eslint/member-ordering
    topicListChanged = this.topicsList.asObservable();

    constructor() {}

    updateTopicList(list: any): void {
        this.topicsList.next(list as any);
    }
}
