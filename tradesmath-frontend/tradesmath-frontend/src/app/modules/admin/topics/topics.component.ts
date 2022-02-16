/* eslint-disable @typescript-eslint/naming-convention */
import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    ActivatedRoute,
    ActivatedRouteSnapshot,
    Router,
} from '@angular/router';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { Topics } from 'app/models/topics';
import { TopicService } from 'app/services/topics.service';
import { sortBy } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';

@Component({
    selector: 'app-topics',
    templateUrl: './topics.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [TopicService],
})
export class TopicsComponent {
    topicsForm: FormGroup;
    topicsList: any = [];
    snapshot: ActivatedRouteSnapshot;
    editKey: string;

    constructor(
        private _formBuilder: FormBuilder,
        private _topicsService: TopicService,
        private _toastrService: ToastrService,
        router: Router,
        activatedRoute: ActivatedRoute
    ) {
        const userInfo = AuthUtils.getUserInfo();
        if (userInfo) {
            if (!userInfo.isAdmin && !userInfo.isSuperAdmin) {
                router.navigate(['/student']);
            }
        }
        this.snapshot = activatedRoute.snapshot;
        this.topicsForm = this._formBuilder.group({
            topicName: ['', Validators.required],
            topicMaterial: ['', Validators.required],
            nextTopics: [[]],
            prevTopics: [[]],
            isActive: [true],
        });
        this.editKey = this.snapshot.queryParams['key'];
        if (this.editKey) {
            this._topicsService
                .getAllTopicsListByKey(this.editKey)
                .subscribe((res) => {
                    if (res.isSuccess) {
                        if (res.data) {
                            const payloadData = res.data;
                            Object.keys(payloadData).map((x) => {
                                if (this.topicsForm.get(x)) {
                                    this.topicsForm
                                        .get(x)
                                        .setValue(payloadData[x]);
                                }
                            });
                        }
                    }
                });
        }
        this.getTopics();
    }

    getTopics(): void {
        this._topicsService.getAllTopicsList().subscribe((res) => {
            if (res.isSuccess) {
                const topicData = [];
                res.data.forEach((result: any) => {
                    topicData.push({
                        ...result,
                        key: result['_id'],
                    });
                });
                this.topicsList = sortBy(topicData, 'topicName');
            }
        });
    }

    saveTopics(): void {
        if (this.topicsForm.invalid) {
            return;
        }
        this.topicsForm.disable();

        try {
            this._getTopicsRef().subscribe((res: any) => {
                if (res.isSuccess) {
                    if (!this.editKey) {
                        this.topicsForm.reset();
                    }
                    this.topicsForm.enable();
                    this._toastrService.success('Topics saved successfully');
                } else {
                    if (!this.editKey) {
                        this.topicsForm.reset();
                    }
                    this.topicsForm.enable();
                    this._toastrService.error('Failed to save topics');
                }
            });
        } catch (error) {}
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    private _getTopicsRef() {
        if (this.editKey) {
            const topicData = this.topicsForm.value as any;
            topicData['topicId'] = this.editKey;
            return this._topicsService.updateTopic(topicData);
        }
        return this._topicsService.createTopic(this.topicsForm.value as Topics);
    }
}
