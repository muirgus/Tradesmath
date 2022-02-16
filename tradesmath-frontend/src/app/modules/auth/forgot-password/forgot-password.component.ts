import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AccountService } from 'app/services/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'auth-forgot-password',
    templateUrl: './forgot-password.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class AuthForgotPasswordComponent implements OnInit {
    @ViewChild('forgotPasswordNgForm') forgotPasswordNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    forgotPasswordForm: FormGroup;
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _accountService: AccountService,
        private _toasterService: ToastrService,
        private _formBuilder: FormBuilder,
        private _router: Router
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.forgotPasswordForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Send the reset link
     */
    sendResetLink(): void {
        // Return if the form is invalid
        if (this.forgotPasswordForm.invalid) {
            return;
        }
        this.forgotPasswordForm.disable();
        this.showAlert = false;
        const input = {
            email: this.forgotPasswordForm.get('email').value,
            invitationLink: `${window.location.origin}/reset-password`,
        };
        this._accountService.forgetPassword(input).subscribe((res) => {
            if (res.isSuccess) {
                this._router.navigate(['/reset-password']);
                this._toasterService.success(res.message);
            } else {
                this._toasterService.error(res.message);
            }
            this.forgotPasswordForm.enable();
        });
    }
}
