import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    AngularFirestore,
    AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Invitations } from 'app/models/invitations';
import { Questions } from 'app/models/questions';
import { Topics } from 'app/models/topics';
import { Users } from 'app/models/users';
import { first } from 'rxjs/operators';
import { QuestionsService } from './questions.service';
import { TopicService } from './topics.service';

@Injectable({
    providedIn: 'root',
})
export class FirebaseToMongoDBMapperService {
    topicsRef: AngularFirestoreCollection<Topics>;
    questionsRef: AngularFirestoreCollection<Questions>;
    usersRef: AngularFirestoreCollection<Users>;
    invitationRef: AngularFirestoreCollection<Invitations>;
    questions: any = [];
    topics: any = [];
    users: any = [];
    invitations: any = [];

    private topicsDB = '/topics';
    private questionsDB = '/questions';
    private usersDB = '/users';
    private invitationDB = '/invitations';

    constructor(
        private _http: HttpClient,
        private _topicService: TopicService,
        private _questionService: QuestionsService,
        private db: AngularFirestore
    ) {
        this.topicsRef = db.collection(this.topicsDB);
        this.questionsRef = db.collection(this.questionsDB);
        this.usersRef = db.collection(this.usersDB);
        this.invitationRef = db.collection(this.invitationDB);
        this.getTopics();
        this.getQuestions();
        this.getUsers();
        this.getInvitations();
    }

    getTopics(): void {
        this.topicsRef
            .snapshotChanges()
            .pipe(first())
            .subscribe((res) => {
                const topicData = [];
                res.forEach((result: any, counter: number) => {
                    topicData.push({
                        key: result.payload.doc.id,
                        ...result.payload.doc.data(),
                    });
                });
                this.topics = topicData;
                this.joinQuestions();
            });
    }

    getQuestions(): void {
        this.questionsRef
            .snapshotChanges()
            .pipe(first())
            .subscribe((res) => {
                const topicData = [];
                res.forEach((result: any, counter: number) => {
                    topicData.push({
                        key: result.payload.doc.id,
                        ...result.payload.doc.data(),
                    });
                });
                this.questions = topicData;
                this.joinQuestions();
            });
    }

    getUsers(): void {
        this.usersRef
            .snapshotChanges()
            .pipe(first())
            .subscribe((res) => {
                const topicData = [];
                res.forEach((result: any, counter: number) => {
                    topicData.push({
                        key: result.payload.doc.id,
                        ...result.payload.doc.data(),
                    });
                });
                topicData.forEach((element) => {
                    element.password = atob(element.password);
                });
                this.users = topicData;
                this.joinQuestions();
            });
    }

    getInvitations(): void {
        this.invitationRef
            .snapshotChanges()
            .pipe(first())
            .subscribe((res) => {
                const topicData = [];
                res.forEach((result: any, counter: number) => {
                    topicData.push({
                        key: result.payload.doc.id,
                        ...result.payload.doc.data(),
                    });
                });
                this.invitations = topicData;
                this.joinQuestions();
            });
    }

    beginMigration(): void {
        this._http
            .post('/api/questions/migrate', {
                questions: this.questions,
                topics: this.topics,
                users: this.users,
                invitations: this.invitations,
            })
            .subscribe((res) => {
                this.transformMigrationData();
            });
    }

    transformMigrationData(): void {
        this._http
            .post('/api/questions/transform-migrate', {
                questions: this.questions,
                topics: this.topics,
                users: this.users,
                invitations: this.invitations,
            })
            .subscribe((res) => {});
    }

    joinQuestions(): void {
        if (
            this.topics.length > 0 &&
            this.questions.length > 0 &&
            this.users.length > 0 &&
            this.invitations.length > 0
        ) {
            this.beginMigration();
            // this.transformMigrationData();
        }
    }
}
