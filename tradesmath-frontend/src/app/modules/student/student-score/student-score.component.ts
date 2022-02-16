import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-student-score',
    templateUrl: './student-score.component.html',
    styleUrls: ['./student-score.component.scss'],
})
export class StudentScoreComponent implements OnInit {
    @Input() questiondata: any = [];
    @Input() topicInfo: any = {};
    @Output() retakeExamInfo = new EventEmitter<any>();
    subtitle: any = '';
    counter: number = 0;
    constructor(private _router: Router) {
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        this._router.routeReuseStrategy.shouldReuseRoute = () => false;
    }

    ngOnInit(): void {
        this.getPercentage();
    }

    isAnswerCorrect(answer: any, correctanswer: any): boolean {
        // eslint-disable-next-line eqeqeq
        return answer == correctanswer;
    }

    getPercentage(): number {
        this.questiondata.forEach((element) => {
            // eslint-disable-next-line eqeqeq
            if (element.answer && element.answer == element.correctanswer) {
                this.counter++;
            }
        });
        this.subtitle = `${this.counter}/ ${this.questiondata.length}`;
        return Math.floor((this.counter / this.questiondata.length) * 100);
    }

    retakeExam(): void {
        this.retakeExamInfo.emit(Math.random() * 10000);
    }

    public get isNextTopic(): boolean {
        return (
            this.topicInfo &&
            this.topicInfo.nextTopics &&
            this.topicInfo.nextTopics.length > 0
        );
    }

    public get isPrevTopic(): boolean {
        return (
            this.topicInfo &&
            this.topicInfo.prevTopics &&
            this.topicInfo.prevTopics.length > 0
        );
    }

    goToHome(): void {
        this._router.navigate(['/student/topics']);
    }

    nextExam(): void {
        if (this.isNextTopic) {
            this._router.navigate(['/student/questions'], {
                queryParams: {
                    key: this.topicInfo.nextTopics[0],
                },
            });
        }
    }

    prevExam(): void {
        if (this.isPrevTopic) {
            this._router.navigate(['/student/questions'], {
                queryParams: {
                    key: this.topicInfo.prevTopics[0],
                },
            });
        }
    }
}
