/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Questions } from 'app/models/questions';
import { QuestionsService } from 'app/services/questions.service';
import { TopicService } from 'app/services/topics.service';
import { head, sortBy } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import * as FileSaver from 'file-saver';

@Component({
    selector: 'app-list-questions',
    templateUrl: './list-questions.component.html',
    styleUrls: ['./list-questions.component.scss'],
    providers: [QuestionsService, TopicService],
})
export class ListQuestionsComponent implements OnInit {
    questionsList: any = [];
    exportDatas: any = [];
    topicsList: any = [];
    displayedColumns: string[] = ['index', 'questionText', 'key'];
    activeQuestions: any = [];
    viewQuestionsDetails = false;
    filterColummn: string[] = ['topicName'];
    showFilter: boolean = false;
    questionDatalist: any = [];
    excelList: any = [];
    constructor(
        private _questionService: QuestionsService,
        private _topicsService: TopicService,
        private _toastrService: ToastrService,
        private _route: Router,
        private _activated: ActivatedRoute
    ) {
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        this._route.routeReuseStrategy.shouldReuseRoute = () => false;
    }
    ngOnInit(): void {
        const topicId = this._activated.snapshot.queryParams['key'];
        if (topicId) {
            this.getQuestionByTopic(topicId);
        } else {
            this.getTopics();
            this.getQuestions();
        }
    }

    getQuestionByTopic(topicId: string): void {
        this._questionService.getQuestionsByTopic(topicId).subscribe((res) => {
            if (res.isSuccess) {
                const payloadData = res.data;
                this.viewQuestionsDetails = true;
                this.activeQuestions = payloadData.questions;
                this.activeQuestions.forEach((element, i) => {
                    element['index'] = i + 1;
                    element['topicName'] = payloadData.topic.topicName;
                });
            }
        });
    }

    exportData(type): void {
        if (type === 'All') {
            this.exportDatas = this.questionsList;
        }
        if (type === 'Topic') {
            this.exportDatas = this.activeQuestions;
        }
        this.excelList = this.exportDatas.map((x: any) => ({
            Index: x.index,
            'Question Text': x.questionText,
            'Topic Name': x.topicName,
            Equation: x.equation,
            'Min 1': x.min1,
            'Max 1': x.max1,
            'Step 1': x.step1,
            'Min 2': x.min2,
            'Max 2': x.max2,
            'Step 2': x.step2,
        }));
        if (this.excelList) {
            this.exportExcel();
        }
    }

    exportExcel(): void {
        if (this.excelList.length > 0) {
            import('xlsx').then((xlsx) => {
                const worksheet = xlsx.utils.json_to_sheet(this.excelList);
                const workbook = {
                    Sheets: { data: worksheet },
                    SheetNames: ['data'],
                };
                const excelBuffer: any = xlsx.write(workbook, {
                    bookType: 'xlsx',
                    type: 'array',
                });
                this.saveAsExcelFile(excelBuffer, 'ExportExcel');
            });
        }
    }

    saveAsExcelFile(buffer: any, fileName: string): void {
        const EXCEL_TYPE =
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE,
        });
        FileSaver.saveAs(
            data,
            fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
        );
    }

    getQuestions(): void {
        this._questionService.getQuestionsList().subscribe((res) => {
            if (res.isSuccess) {
                const questionData = [];
                res.data.forEach((result: any, counter: number) => {
                    questionData.push({
                        index: counter + 1,
                        ...result,
                        key: result['_id'],
                        isExpanded: false,
                    });
                });
                this.questionsList = questionData;
                this.showFilter = true;
                this.joinQuestions();
            }
        });
    }

    joinQuestions(): void {
        const self = this;
        this.questionsList.forEach((element) => {
            element.topicName = self.topicsList.find(
                (x: any) => x['key'] === element.topicId
            )?.topicName;
        });
        this.questionsList = sortBy(this.questionsList, 'topicName');
        this.questionDatalist = this.questionsList;
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
                this.topicsList = topicData;
                this.joinQuestions();
            }
        });
    }

    GetFilteredData(event): void {
        this.questionDatalist = [];
        this.questionDatalist = event;
    }

    deleteQuestions(payload: Questions): void {
        if (confirm('Are you sure you want to delete it?')) {
            this._questionService
                .deleteQuestions(payload.key)
                .subscribe((res) => {
                    if (res.isSuccess) {
                        this.getQuestions();
                        this._toastrService.success(
                            'Question deleted successfully'
                        );
                    } else {
                        this._toastrService.error('Failed to delete question');
                    }
                });
        }
    }

    editQuestions(payload: Questions): void {
        this._route.navigate(['/app/questions'], {
            queryParams: {
                key: (payload as any)._id,
            },
        });
    }

    setActiveQuestions(payload: Questions[]): void {
        this._route.navigate(['/app/view-questions'], {
            queryParams: {
                key: payload[0].topicId,
            },
        });
        // this.viewQuestionsDetails = true;
        // const newPayload = JSON.parse(JSON.stringify(payload));
        // newPayload.map((x, i) => (x.index = i + 1));
        // this.activeQuestions = newPayload;
    }

    viewQuestionTemplate(): void {
        this._route.navigate(['/app/question-templates'], {
            queryParams: {
                key: head(this.activeQuestions.map((x: any) => x.topicId)),
            },
        });
    }

    public get getTopicsGroup(): any {
        return this._groupArray(this.questionDatalist, (x: any) => x.topicId);
    }

    private _groupArray(array, func): any {
        const groups = {};
        array.forEach((o) => {
            const group = JSON.stringify(func(o));
            groups[group] = groups[group] || [];
            groups[group].push(o);
        });
        return Object.keys(groups).map((group: any) => groups[group]);
    }
}
