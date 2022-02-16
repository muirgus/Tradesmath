/* eslint-disable no-eval */
/* eslint-disable eqeqeq */
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute } from '@angular/router';
import { Topics } from 'app/models/topics';
import { QuestionsService } from 'app/services/questions.service';

@Component({
    selector: 'app-question-templates',
    templateUrl: './question-templates.component.html',
    styleUrls: ['./question-templates.component.scss'],
})
export class QuestionTemplatesComponent implements OnInit {
    isSubmitted: boolean = false;
    questionAnswerForm: FormGroup;
    questions: any[] = [];
    questionKey: '';
    topicInfo: Topics;
    isFraction: boolean = false;
    // eslint-disable-next-line @typescript-eslint/member-ordering
    @ViewChild('horizontalStepper', {
        static: false,
    })
    horizontalStepper: MatStepper;
    data: any = [];
    constructor(
        private _formBuilder: FormBuilder,
        private _questionsService: QuestionsService,
        _activated: ActivatedRoute
    ) {
        this.questionKey = _activated.snapshot.queryParams['key'];
        this.getQuestionFromKey();
    }

    ngOnInit(): void {
        this.initQuestions();
    }

    initQuestions(): void {
        const formControlGroup = {};
        this.questions.forEach((element, i) => {
            formControlGroup[`question${i}`] = this._formBuilder.group({
                question: element.question,
                answer: [''],
                showAnswer: [false],
                image: element.questionImage,
            });
        });

        this.questionAnswerForm = this._formBuilder.group(formControlGroup);
    }

    getQuestionFromKey(): void {
        this.questions = [];
        this._questionsService
            .getQuestionsByTopic(this.questionKey)
            .subscribe((res) => {
                if (res.isSuccess) {
                    const question = res.data.questions
                        .sort(() => Math.random() - Math.random())
                        .slice(0, 5);
                    this.topicInfo = res.data.topic;
                    this.topicInfo['key'] = this.topicInfo['_id'];
                    // eslint-disable-next-line @typescript-eslint/prefer-for-of
                    for (let i = 0; i < question.length; i++) {
                        const tempData = {
                            ...question[i],
                            key: question[i]._id,
                        };
                        this.questions.push(tempData);
                    }
                    this.questions.forEach((element) => {
                        element.question = element.questionText;
                        let textBetween = window['getFromBetween'].get(
                            element.questionText,
                            '||',
                            '||'
                        );
                        textBetween = Array.from(
                            new Set(
                                textBetween
                                    .map((x: string) => x.trim())
                                    .filter((x: string) => x)
                            )
                        );
                        textBetween.forEach((item, i) => {
                            element[item] = this.randomNumber(
                                parseFloat(element[`min${i + 1}`]),
                                parseFloat(element[`max${i + 1}`]),
                                parseFloat(element[`step${i + 1}`])
                            );
                            element[item] = parseFloat(
                                parseFloat(`${element[item]}`).toFixed(2)
                            );
                            element.question = element.question.replaceAll(
                                `||${item}||`,
                                element[item]
                            );
                        });
                    });
                    this.initQuestions();
                    this.makeEquationsValues();
                }
            });
    }

    makeEquationsValues(): void {
        const isImperialTopic = this.topicInfo.topicName.includes('Imperial');
        this.isFraction =
            this.questions.filter((x: any) => x.question.includes('<mfrac>'))
                .length > 0;
        this.questions.forEach((element) => {
            if ((element.equation.split('||').length - 1) % 2 === 0) {
                element.equationSimplified = element.equation;
                let textBetween = window['getFromBetween'].get(
                    element.equation,
                    '||',
                    '||'
                );
                textBetween = Array.from(
                    new Set(
                        textBetween
                            .map((x: string) => x.trim())
                            .filter((x: string) => x)
                    )
                );
                textBetween.forEach((item, i) => {
                    element.equationSimplified =
                        element.equationSimplified.replaceAll(
                            `||${item}||`,
                            element[item]
                        );
                });
                try {
                    if (element.equation.includes('~')) {
                        const splitData = ['ADD', 'SUB', 'MUL', 'DIV'];
                        const splitDataEq = ['+', '-', '*', '/'];
                        let foundIndex = -1;
                        if (
                            splitData.filter((x: any, i: number) => {
                                if (element.equationSimplified.includes(x)) {
                                    foundIndex = i;
                                }
                                return element.equationSimplified.includes(x);
                            }).length > 0
                        ) {
                            if (foundIndex >= 0) {
                                const splitRoundings =
                                    element.equationSimplified.split(
                                        splitData[foundIndex]
                                    );
                                const splifiedData = [];
                                splitRoundings.forEach((rounding) => {
                                    let lastValue = rounding.split('~')[1];
                                    let firstValue = rounding.split('~')[0];
                                    if (lastValue && firstValue) {
                                        lastValue = parseFloat(
                                            lastValue.trim()
                                        );
                                        firstValue = parseFloat(
                                            eval(firstValue.trim())
                                        );
                                        splifiedData.push(
                                            Math.round(
                                                eval(firstValue) / lastValue
                                            ) * lastValue
                                        );
                                    }
                                });
                                element.answer = (window as any).math.evaluate(
                                    splifiedData.join(splitDataEq[foundIndex])
                                );
                            }
                        } else {
                            let lastValue =
                                element.equationSimplified.split('~')[1];
                            let firstValue =
                                element.equationSimplified.split('~')[0];
                            if (lastValue && firstValue) {
                                lastValue = parseFloat(lastValue.trim());
                                firstValue = parseFloat(
                                    eval(firstValue.trim())
                                );
                                element.answer =
                                    Math.round(eval(firstValue) / lastValue) *
                                    lastValue;
                            }
                        }
                    } else {
                        const evaluatedAnswer = (window as any).math.evaluate(
                            element.equationSimplified
                        );
                        if (typeof evaluatedAnswer !== 'object') {
                            element.answer = parseFloat(
                                parseFloat(evaluatedAnswer).toFixed(2)
                            );
                        } else if (
                            typeof evaluatedAnswer === 'object' &&
                            evaluatedAnswer._data
                        ) {
                            element.answer = evaluatedAnswer._data.reduce(
                                (a, b) => a + b,
                                0
                            );
                        }
                    }
                    if (
                        element.question.includes('<mfrac>') ||
                        this.isFraction
                    ) {
                        this.isFraction = true;
                        let mainEq =
                            element.equationSimplified.split(/[+]/).length > 1
                                ? '+'
                                : element.equationSimplified.split(/[-]/)
                                      .length > 1
                                ? '-'
                                : '';
                        if (
                            this.topicInfo.topicName.toLowerCase() ===
                            'Dividing Fractions'.toLowerCase()
                        ) {
                            mainEq = '/';
                        }
                        if (mainEq) {
                            let splittedEq =
                                element.equationSimplified.split(/[+-]/);
                            if (
                                this.topicInfo.topicName.toLowerCase() ===
                                'Dividing Fractions'.toLowerCase()
                            ) {
                                splittedEq =
                                    element.equationSimplified.split(/[/]/);
                            }
                            splittedEq = splittedEq.map((x: any) => `(${x})`);
                            let dominatorResult = 1;
                            const dominatorsList = [];
                            splittedEq.forEach((data: any) => {
                                if (`${eval(data)}`.includes('.')) {
                                    let splitDenom = data.split(/[*\/]/);
                                    splitDenom = splitDenom[
                                        splitDenom.length - 1
                                    ]
                                        .replaceAll('(', '')
                                        .replaceAll(')', '')
                                        .trim();
                                    dominatorsList.push(splitDenom);
                                }
                            });
                            dominatorResult = Array.from(
                                new Set(dominatorsList)
                            ).reduce((x, y) => x * y, 1);
                            element.equationSimplified =
                                splittedEq.join(mainEq);
                            const answer = parseFloat(
                                `${parseFloat(
                                    `${
                                        eval(element.equationSimplified) *
                                        dominatorResult
                                    }`
                                ).toFixed(2)}`
                            );
                            try {
                                if (dominatorResult > 1) {
                                    element.answer = `${answer}/${dominatorResult}`;
                                    const simplified = (
                                        window as any
                                    ).math.fraction(element.answer);
                                    if (simplified) {
                                        element.answer = `${simplified.n}/${simplified.d}`;
                                    }
                                } else {
                                    element.answer = answer;
                                    const simplified = (
                                        window as any
                                    ).math.fraction(element.answer);
                                    if (simplified) {
                                        element.answer = `${simplified.n}/${simplified.d}`;
                                    }
                                }
                            } catch (error) {}
                        }
                        if (isImperialTopic) {
                            element.answer = (window as any).math.evaluate(
                                element.answer
                            );
                        }
                    }
                } catch (err) {}
            } else {
                try {
                    const splitEquation = element.equation.split('||');
                    const totalLenght = splitEquation.length;
                    let dataCalculates = [];
                    const midValue = totalLenght / 2;
                    const dataArray = [
                        splitEquation.slice(0, midValue).join('||'),
                        splitEquation.slice(midValue, totalLenght).join('||'),
                    ];
                    dataArray.forEach((newElement) => {
                        element.equationSimplified = element.equation;
                        let textBetween = window['getFromBetween'].get(
                            newElement,
                            '||',
                            '||'
                        );
                        textBetween = Array.from(
                            new Set(
                                textBetween
                                    .map((x: string) => x.trim())
                                    .filter((x: string) => x)
                            )
                        );
                        textBetween.forEach((item, i) => {
                            element.equationSimplified =
                                element.equationSimplified.replaceAll(
                                    `||${item}||`,
                                    element[item]
                                );
                        });
                    });
                    dataCalculates = element.equationSimplified.split('||');
                    dataCalculates.map((x: any) => (x = eval(x)));
                    if (dataCalculates.every((x: any) => x === true)) {
                        element.answer = 'equal';
                    } else if (
                        dataCalculates.filter((x: any) => x === true).length >=
                        dataCalculates.length - 1
                    ) {
                        element.answer = 'greater';
                    } else {
                        element.answer = 'lesser';
                    }
                } catch (error) {}
            }
        });
        (window as any).questions = this.questions;
    }

    randomNumber(min, max, step): number {
        const range = (max - min) / step;
        return `${min}`.includes('.') || `${max}`.includes('.')
            ? parseFloat(
                  parseFloat(
                      Math.floor(Math.random() * range) * step + min
                  ).toFixed(2)
              )
            : Math.floor(Math.random() * range) * step + min;
    }

    onSubmit(formValue): void {
        if (
            this.horizontalStepper.selectedIndex ===
            this.questions.length - 1
        ) {
            this.getQuestionFromKey();
        }
    }

    getGroups(): any {
        return Object.keys(this.questionAnswerForm.value);
    }

    toggleAnswer(form: any): void {
        form.get('showAnswer').setValue(!form.get('showAnswer').value);
    }

    openHint(): void {
        window.open(this.topicInfo.topicMaterial, '_BLANK');
    }

    retakeExamInfo($event: any): void {
        this.getQuestionFromKey();
        this.isSubmitted = false;
    }
}
