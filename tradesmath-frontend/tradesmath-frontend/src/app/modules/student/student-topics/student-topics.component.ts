import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Topics } from 'app/models/topics';
import { FirebaseToMongoDBMapperService } from 'app/services/firebase-to-mongo-db-mapper.service';
import { TopicService } from 'app/services/topics.service';
import { sortBy } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { StudentSharedService } from '../student-shared.service';

@Component({
    selector: 'app-student-topics',
    templateUrl: './student-topics.component.html',
    styleUrls: ['./student-topics.component.scss'],
    providers: [TopicService],
})
export class StudentTopicsComponent {
    topicsList: any = [];
    questionsList: any = [];
    displayedColumns: string[] = [
        'index',
        'topicName',
        'questionsCount',
        'finalScore',
        'key',
    ];
    filterColummn: string[] = [
        'index',
        'topicName',
        'questionsCount',
        'finalScore',
    ];
    lastAnswerGiven: any = {};
    showFilter: boolean = false;
    studentTopicDataList: any = [];
    isGridView = true;
    activeTopic = new Topics();

    constructor(
        private _topicsService: TopicService,
        private _route: Router,
        private _toastrService: ToastrService,
        private _studentShared: StudentSharedService
    ) {
        this.getLastTopic();
        this.getTopics();
    }

    getLastTopic(): void {
        this._topicsService.lastAnswer().subscribe((res) => {
            this.lastAnswerGiven = res.topicInfo;
        });
    }

    getTopics(): void {
        this._topicsService.getStudentTopics().subscribe((res) => {
            if (res.isSuccess) {
                const topicData = [];
                res.data.forEach((result: any, counter: number) => {
                    topicData.push({
                        index: counter + 1,
                        ...result,
                        key: result['_id'],
                        prevTopicsName: '',
                        nextTopicsName: '',
                        progress: 0,
                    });
                });
                topicData.forEach((element) => {
                    if (element.nextTopics) {
                        element.nextTopicsName = topicData
                            .filter((x: any) =>
                                element.nextTopics.includes(x['key'])
                            )
                            .map((x: any) => x['topicName'])
                            .join(',');
                        element.nextTopicsInfo = topicData.filter((x: any) =>
                            element.nextTopics.includes(x['key'])
                        );
                    }
                    if (element.prevTopics) {
                        element.prevTopicsName = topicData
                            .filter((x: any) =>
                                element.prevTopics.includes(x['key'])
                            )
                            .map((x: any) => x['topicName'])
                            .join(',');
                        element.prevTopicsInfo = topicData.filter((x: any) =>
                            element.prevTopics.includes(x['key'])
                        );
                    }
                });
                this.topicsList = sortBy(topicData, 'topicName');
                this.topicsList.map((x, i) => (x.index = i + 1));
                // if (this.topicsList.length > 0) {
                //     this.setActiveQuestions(this.topicsList[0], false);
                // }
                this.studentTopicDataList = this.topicsList;
                // this._studentShared.updateTopicList(
                //     this.studentTopicDataList as any
                // );
                this.showFilter = true;
            }
        });
    }

    setActiveQuestions(
        payload: Topics,
        showTopicChanged: boolean = true
    ): void {
        if (payload.key) {
            this._route.navigate(['/student/topic-detail'], {
                queryParams: {
                    key: payload.key,
                },
            });
        }
    }

    navigateToTopic(): void {
        this._route.navigate(['/student/questions'], {
            queryParams: {
                key: this.activeTopic.key,
            },
        });
    }

    getFilteredData(event): void {
        this.studentTopicDataList = event;
    }
}
