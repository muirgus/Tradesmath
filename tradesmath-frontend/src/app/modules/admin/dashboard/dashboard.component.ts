import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AnalyticsService } from 'app/services/analytics.service';
import * as Highcharts from 'highcharts';
import moment from 'moment';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
    range = new FormGroup({
        start: new FormControl(
            new Date(moment(new Date()).add('month', -1).format('YYYY-MM-DD'))
        ),
        end: new FormControl(new Date()),
    });
    answersColor = ['#9b59b6', '#27ae60', '#A2191F', '#1abc9c', '#f39c12'];
    topics = new FormControl();
    countInfo: any = {
        usersCount: 0,
        superAdminCount: 0,
        adminCount: 0,
        topicsCount: 0,
        questionsCount: 0,
    };
    questionsBetween: any = [];
    wrongQuestions: any = [];
    isDataLoaded: any = {
        questions: false,
        wrongAnswer: false,
    };
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Highcharts: typeof Highcharts = Highcharts;
    wrongAnswers: Highcharts.Options = {};
    lineChart: Highcharts.Options = {};

    constructor(
        private _analyticsService: AnalyticsService,
        private changeDetector: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.getAnalyticsCounts();
        this.getQuestionAnalytics();
        this.getTopWrongAnswers();
    }

    getTopWrongAnswers(): void {
        this._analyticsService.getTopWrongAnswers().subscribe((res) => {
            this.wrongQuestions = res.data.wrongAnswers;
            this.wrongAnswers = {
                title: {
                    text: '',
                },
                legend: {
                    enabled: false,
                },
                xAxis: {
                    categories: this.wrongQuestions.map(
                        (x: any) => x.topicName
                    ),
                },
                yAxis: {
                    title: {
                        text: 'Wrong Answers Count',
                    },
                },
                tooltip: {
                    // eslint-disable-next-line space-before-function-paren
                    formatter: function (): string {
                        return `<div style="width: 200px">${this.point['text']}</div>`;
                    },
                },
                credits: {
                    enabled: false,
                },
                series: [
                    {
                        name: 'Question',
                        type: 'column',
                        data: this.wrongQuestions.map((x: any, i: number) => ({
                            y: x.count,
                            text: x.text,
                            color: '#4f46e5',
                        })),
                    },
                ],
            };
            this.isDataLoaded.wrongAnswer = true;
        });
    }

    getQuestionAnalytics(): void {
        this.isDataLoaded.questions = false;
        this._analyticsService
            .getQuestionsBetween({
                startDate: this.range.get('start').value,
                endDate: this.range.get('end').value,
            })
            .subscribe((res) => {
                this.questionsBetween = res.data.questions;
                this.lineChart = {
                    chart: {
                        type: 'area',
                        zoomType: 'xy',
                    },
                    title: {
                        text: '',
                    },
                    xAxis: {
                        categories: this.questionsBetween.map(
                            (x: any) => x.date
                        ),
                        title: {
                            text: 'Questions generated',
                        },
                    },
                    yAxis: {
                        title: {
                            text: 'Questions generated',
                        },
                    },
                    legend: {
                        enabled: false,
                    },
                    credits: {
                        enabled: false,
                    },
                    series: [
                        {
                            name: 'Total questions generated',
                            type: 'area',
                            color: '#27ae60',
                            data: this.questionsBetween.map(
                                (x: any) => x.count
                            ),
                        },
                    ],
                };
                this.isDataLoaded.questions = true;
            });
    }

    getAnalyticsCounts(): void {
        this._analyticsService.getAnalytics().subscribe((res) => {
            this.countInfo = res.data;
        });
    }
}
