import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AccountService } from 'app/services/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'auth-confirmation-required',
    templateUrl: './confirmation-required.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class AuthConfirmationRequiredComponent implements OnInit {
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    signInForm: FormGroup;
    showAlert: boolean = false;

    constructor(
        private _formBuilder: FormBuilder,
        private _accountService: AccountService,
        private _router: Router,
        private _toastrService: ToastrService
    ) {}

    ngOnInit(): void {
        this.signInForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            activationCode: ['', Validators.required],
        });
    }

    activateAccount(): void {
        if (this.signInForm.invalid) {
            return;
        }

        this.signInForm.disable();

        this.showAlert = false;
        this._accountService
            .activateAccount({
                email: this.signInForm.value.email,
                accountActivationCode: this.signInForm.value.activationCode,
            })
            .subscribe(
                (res) => {
                    if (res.isSuccess) {
                        this._toastrService.success(res.message);
                        this._router.navigate(['/sign-in']);
                    } else {
                        this.alert = {
                            type: 'error',
                            message: res.message,
                        };
                        this.showAlert = true;
                        this.signInForm.enable();
                    }
                },
                () => {
                    this.alert = {
                        type: 'error',
                        message: 'Failed to activate account',
                    };
                    this.showAlert = true;
                    this.signInForm.enable();
                }
            );
    }
}
