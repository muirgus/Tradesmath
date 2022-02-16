import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
    ActivatedRoute,
    ActivatedRouteSnapshot,
    Router,
} from '@angular/router';
import { AccountService } from 'app/services/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-users-details',
    templateUrl: './users-details.component.html',
})
export class UsersDetailsComponent {
    snapshot: ActivatedRouteSnapshot;
    editKey: string;
    usersForm: FormGroup;

    constructor(
        private _accountService: AccountService,
        private _formBuilder: FormBuilder,
        private _toastrService: ToastrService,
        activatedRoute: ActivatedRoute,
        private _route: Router
    ) {
        this.snapshot = activatedRoute.snapshot;
        this.editKey = this.snapshot.queryParams['key'];
        this.usersForm = this._formBuilder.group({
            firstName: [''],
            lastName: [''],
            email: [''],
            isAdmin: [false],
            isSuperAdmin: [false],
            isActive: [false],
        });
        if (this.editKey) {
            this._accountService
                .checkUserInfoByKey(this.editKey)
                .subscribe((res) => {
                    if (res.isSuccess) {
                        const payloadData = res.data;
                        Object.keys(payloadData).map((x) => {
                            if (this.usersForm.get(x)) {
                                this.usersForm.get(x).setValue(payloadData[x]);
                            }
                        });
                    }
                });
        }
    }

    saveUsersDetails(): void {
        if (this.usersForm.invalid) {
            return;
        }
        this.usersForm.disable();
        const user = this.usersForm.value;
        this._accountService.updateUsers(user).subscribe((res) => {
            if (res.isSuccess) {
                if (!this.editKey) {
                    this.usersForm.reset();
                }
                this._toastrService.success('Users updated successfully');
            } else {
                this._toastrService.error('Failed to updated user');
            }
            this.usersForm.enable();
        });
    }

    cancel(): void {
        this._route.navigate(['/app/users']);
    }
}
