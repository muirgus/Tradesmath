import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Topics } from 'app/models/topics';
import { TopicService } from 'app/services/topics.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-student-assessment',
    templateUrl: './student-assessment.component.html',
    styleUrls: ['./student-assessment.component.scss'],
})
export class StudentAssessmentComponent {
    activeTopic = new Topics();
    initialView = new Topics();
    topicKey = '';
    constructor(
        private _route: Router,
        private _topicService: TopicService,
        private _toastrService: ToastrService,
        _activated: ActivatedRoute
    ) {
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        this._route.routeReuseStrategy.shouldReuseRoute = () => false;
        this.topicKey = _activated.snapshot.queryParams['key'];
        if (this.topicKey) {
            this.getDetails();
        } else {
            this._topicService.lastAnswer().subscribe((res) => {
                if (res.isSuccess) {
                    if (res.topic) {
                        this._route.navigate(['/student/topic-detail'], {
                            queryParams: {
                                key: res.topic,
                            },
                        });
                    }
                }
            });
        }
    }

    getDetails(): void {
        this._topicService
            .getAllTopicsListByKey(this.topicKey)
            .subscribe((res) => {
                if (res.isSuccess) {
                    if (res.data) {
                        const payloadData = res.data;
                        payloadData.nextPrevTopics.forEach(
                            (x: any) => (x.key = x._id)
                        );
                        payloadData.nextTopicsInfo =
                            payloadData.nextPrevTopics.filter((x: any) =>
                                payloadData.nextTopics.includes(x.key)
                            );
                        payloadData.prevTopicsInfo =
                            payloadData.nextPrevTopics.filter((x: any) =>
                                payloadData.prevTopics.includes(x.key)
                            );
                        this.activeTopic = payloadData;
                        this.activeTopic.key = payloadData._id;
                        this.initialView = JSON.parse(
                            JSON.stringify(this.activeTopic)
                        );
                    }
                }
            });
    }

    navigateToTopic(): void {
        this._route.navigate(['/student/questions'], {
            queryParams: {
                key: this.activeTopic.key,
            },
        });
    }

    navigateToAssessment(): void {
        this._route.navigate(['/student/topic-detail'], {
            queryParams: {
                key: this.activeTopic.key,
            },
        });
    }

    resetToInitial(): void {
        this.activeTopic = this.initialView;
        this._toastrService.success('Topics reset');
    }

    setActiveQuestions(payload: Topics): void {
        if (payload.key) {
            this.activeTopic = payload;
            this._toastrService.success('Topic changed');
            this.navigateToAssessment();
        }
    }

    public get nextTopics(): Array<any> {
        const active = this.activeTopic as any;
        if (active && active.nextTopicsInfo) {
            return active.nextTopicsInfo;
        }
        return [];
    }

    public get prevTopics(): Array<any> {
        const active = this.activeTopic as any;
        if (active && active.prevTopicsInfo) {
            return active.prevTopicsInfo;
        }
        return [];
    }
}
