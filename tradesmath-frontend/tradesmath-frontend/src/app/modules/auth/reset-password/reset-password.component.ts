import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseValidators } from '@fuse/validators';
import { AccountService } from 'app/services/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'auth-reset-password',
    templateUrl: './reset-password.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class AuthResetPasswordComponent implements OnInit {
    @ViewChild('resetPasswordNgForm') resetPasswordNgForm: NgForm;
    resetPasswordForm: FormGroup;
    showAlert: boolean = false;
    constructor(
        private _accountService: AccountService,
        private _formBuilder: FormBuilder,
        private _toasterService: ToastrService,
        private _router: Router
    ) {}
    ngOnInit(): void {
        this.resetPasswordForm = this._formBuilder.group(
            {
                email: ['', [Validators.required, Validators.email]],
                otpCode: ['', [Validators.required]],
                password: ['', Validators.required],
                passwordConfirm: ['', Validators.required],
            },
            {
                validators: FuseValidators.mustMatch(
                    'password',
                    'passwordConfirm'
                ),
            }
        );
    }
    resetPassword(): void {
        if (this.resetPasswordForm.invalid) {
            return;
        }
        this.resetPasswordForm.disable();
        this.showAlert = false;
        const input = {
            email: this.resetPasswordForm.get('email').value,
            otpCode: this.resetPasswordForm.get('otpCode').value,
            newPassword: this.resetPasswordForm.get('password').value,
            confirmPassword:
                this.resetPasswordForm.get('passwordConfirm').value,
        };
        this._accountService.resetPassword(input).subscribe((res) => {
            if (res.isSuccess) {
                this._toasterService.success(res.message);
                this._router.navigateByUrl('/sign-in');
            } else {
                this._toasterService.error(res.message);
            }
            this.resetPasswordForm.enable();
        });
    }
}
