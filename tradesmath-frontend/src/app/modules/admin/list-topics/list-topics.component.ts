/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Topics } from 'app/models/topics';
import { TopicService } from 'app/services/topics.service';
import { sortBy } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import * as FileSaver from 'file-saver';

@Component({
    selector: 'app-list-topics',
    templateUrl: './list-topics.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [TopicService],
})
export class ListTopicsComponent {
    topicsList: any = [];
    excelList: any = [];
    displayedColumns: string[] = [
        'index',
        'topicName',
        'topicMaterial',
        'nextTopicsName',
        'prevTopicsName',
        'isActive',
        'key',
    ];
    filterColummn: string[] = [
        'index',
        'topicName',
        'topicMaterial',
        'nextTopicsName',
        'prevTopicsName',
    ];
    topicDataList: any = [];
    showFilter: boolean = false;
    constructor(
        private _topicsService: TopicService,
        private _route: Router,
        private _toastrService: ToastrService
    ) {
        this.getTopics();
    }

    exportExcel(): void {
        this.excelList = this.topicDataList.map((x: any) => ({
            Index: x.index,
            'Topic Name': x.topicName,
            'Topic Material': x.topicMaterial,
            'Next Topics': x.nextTopicsName,
            'Perivious Topics': x.prevTopicsName,
        }));
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

    getTopics(): void {
        this._topicsService.getAllTopicsList().subscribe((res) => {
            if (res.isSuccess) {
                const topicData = [];
                res.data.forEach((result: any, counter: number) => {
                    topicData.push({
                        index: counter + 1,
                        ...result,
                        key: result['_id'],
                        prevTopicsName: '',
                        nextTopicsName: '',
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
                    }
                    if (element.prevTopics) {
                        element.prevTopicsName = topicData
                            .filter((x: any) =>
                                element.prevTopics.includes(x['key'])
                            )
                            .map((x: any) => x['topicName'])
                            .join(',');
                    }
                });
                this.topicsList = sortBy(topicData, 'topicName');
                this.topicsList.map((x, i) => (x.index = i + 1));
                this.showFilter = true;
                this.topicDataList = this.topicsList;
            }
        });
    }

    deleteTopics(payload: Topics): void {
        if (confirm('Are you sure you want to delete it?')) {
            this._topicsService
                .deleteTopic(payload.key)
                .subscribe((res: any) => {
                    if (res.isSuccess) {
                        this.getTopics();
                        this._toastrService.success(
                            'Topic deleted successfully'
                        );
                    } else {
                        this._toastrService.error('Failed to delete it');
                    }
                });
        }
    }

    editTopics(payload: Topics): void {
        this._route.navigate(['/app/topics'], {
            queryParams: {
                key: payload._id,
            },
        });
    }

    GetFilteredData(event): void {
        this.topicDataList = event;
    }
}
