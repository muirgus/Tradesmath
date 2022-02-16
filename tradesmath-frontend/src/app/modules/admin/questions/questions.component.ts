import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Questions } from 'app/models/questions';
import { QuestionsService } from 'app/services/questions.service';
import { TopicService } from 'app/services/topics.service';
import { sortBy } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { finalize, first } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
    selector: 'app-questions',
    templateUrl: './questions.component.html',
    providers: [TopicService, QuestionsService],
})
export class QuestionsComponent {
    questionsForm: FormGroup;
    topicsList: any = [];
    snapshot: ActivatedRouteSnapshot;
    editKey: string;
    imageSrc: any = '';
    imageBaseData: string | ArrayBuffer = null;

    constructor(
        private _formBuilder: FormBuilder,
        private _questionService: QuestionsService,
        private _topicsService: TopicService,
        private _toastrService: ToastrService,
        activatedRoute: ActivatedRoute
    ) {
        this.snapshot = activatedRoute.snapshot;
        this.questionsForm = this._formBuilder.group({
            questionText: ['', Validators.required],
            equation: ['', Validators.required],
            min1: ['', Validators.required],
            max1: ['', Validators.required],
            step1: ['', Validators.required],
            min2: ['', Validators.required],
            max2: ['', Validators.required],
            step2: ['', Validators.required],
            topicId: ['', Validators.required],
            imageLink: [''],
            videoLink: [''],
            uploadImage: [''],
        });
        this.editKey = this.snapshot.queryParams['key'];
        if (this.editKey) {
            this._questionService
                .getQuestionsListByKey(this.editKey)
                .subscribe((res) => {
                    if (res.isSuccess) {
                        const payloadData = res.data;
                        Object.keys(payloadData).map((x) => {
                            if (this.questionsForm.get(x)) {
                                this.questionsForm
                                    .get(x)
                                    .setValue(payloadData[x]);
                            }
                        });
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

    saveQuestions(): void {
        if (this.questionsForm.invalid) {
            return;
        }
        this.questionsForm.disable();
        try {
            this.questionsForm.value.uploadImage = this.imageSrc;
            if (this.editKey) {
                this.questionsForm.value['questionId'] = this.editKey;
            }
            this._getQuestionRef().subscribe((res) => {
                if (res.isSuccess) {
                    if (!this.editKey) {
                        this.questionsForm.reset();
                    }
                    this.imageBaseData = '';
                    this.imageSrc = null;
                    this._toastrService.success('Questions saved successfully');
                } else {
                    this._toastrService.error('Failed to add questions');
                }
                this.questionsForm.enable();
            });
        } catch (error) {}
    }

    onFileSelected(files: any): void {
        const self = this;
        const file = files[0];
        this.imageSrc = file;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (): void => {
            self.imageBaseData = reader.result;
        };
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    private _getQuestionRef() {
        const formData = new FormData();
        Object.keys(this.questionsForm.value).map((x: any) =>
            formData.append(x, this.questionsForm.value[x])
        );
        if (this.editKey) {
            return this._questionService.updateQuestions(formData);
        }
        return this._questionService.createQuestion(formData);
    }
}
