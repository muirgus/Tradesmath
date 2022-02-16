import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { Invitations } from 'app/models/invitations';
import { InvitationService } from 'app/services/invitations.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-invitations',
    templateUrl: './invitations.component.html',
    styleUrls: ['./invitations.component.scss'],
    providers: [InvitationService],
})
export class InvitationComponent implements OnInit {
    invitationForm: FormGroup;
    user: User;
    previousInvitation: string;
    submited: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
        private _formBuilder: FormBuilder,
        private _invitationService: InvitationService,
        private _userService: UserService,
        private _toastrService: ToastrService,
        private _route: Router
    ) {
        this.invitationForm = this._formBuilder.group({
            invitationLink: [this.uuidv4(), Validators.required],
            email: ['', [Validators.required, Validators.email]],
            name: ['', Validators.required],
        });
    }

    ngOnInit(): void {
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;
            });
    }

    public get invitationUrl(): string {
        if (this.invitationForm.get('invitationLink').value) {
            return `${window.location.origin}/admin/registration?key=${
                this.invitationForm.get('invitationLink').value
            }`;
        }
        return '';
    }

    uuidv4(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
            /[xy]/g,
            (item) => {
                // eslint-disable-next-line no-bitwise
                const random = (Math.random() * 16) | 0;
                // eslint-disable-next-line no-bitwise
                const value = item === 'x' ? random : (random & 0x3) | 0x8;
                return value.toString(16);
            }
        );
    }

    refreshGuid(): void {
        this.invitationForm.get('invitationLink').setValue(this.uuidv4());
    }

    saveInvitation(): void {
        this.submited = true;
        if (this.invitationForm.invalid) {
            return;
        }
        this.invitationForm.disable();
        this.previousInvitation =
            this.invitationForm.get('invitationLink').value;
        const invitationObj = {
            email: this.invitationForm.get('email').value,
            name: this.invitationForm.get('name').value,
            invitationId: this.invitationForm.get('invitationLink').value,
            invitationLink: this.invitationUrl,
            invitationBy: this.user.key,
            isValid: true,
        } as any;
        this._invitationService
            .createInvitation(invitationObj)
            .subscribe((res) => {
                if (res.isSuccess) {
                    this.invitationForm.reset();
                    this.submited = false;
                    this.invitationForm.markAsUntouched();
                    this._toastrService.success(res.message);
                } else {
                    this._toastrService.error(res.message);
                }
                this.refreshGuid();
                this.invitationForm.enable();
            });
    }
}
