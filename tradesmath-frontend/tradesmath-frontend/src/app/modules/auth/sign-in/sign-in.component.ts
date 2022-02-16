import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { UserService } from 'app/core/user/user.service';
import { AuthMockApi } from 'app/mock-api/common/auth/api';
import { AccountService } from 'app/services/account.service';

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class AuthSignInComponent implements OnInit {
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    signInForm: FormGroup;
    showAlert: boolean = false;
    showActivateAccount: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _userService: UserService,
        private _accountService: AccountService,
        private _mockApi: AuthMockApi
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.signInForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            rememberMe: [''],
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    signIn(): void {
        this.showActivateAccount = false;
        // Return if the form is invalid
        if (this.signInForm.invalid) {
            return;
        }

        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;

        this._accountService
            .signIn({
                email: this.signInForm.value.email,
                password: this.signInForm.value.password,
            })
            .subscribe((res) => {
                if (res.isSuccess) {
                    this._authService.accessToken = res.token;

                    this._authService._authenticated = true;
                    localStorage.setItem(
                        'info',
                        btoa(JSON.stringify(res.userInfo))
                    );

                    this._userService.user = res.userInfo;
                    const redirectURL =
                        this._activatedRoute.snapshot.queryParamMap.get(
                            'redirectURL'
                        ) || '/signed-in-redirect';

                    if (res.userInfo.isSuperAdmin || res.userInfo.isAdmin) {
                        this._router.navigateByUrl(redirectURL);
                    } else {
                        if (res.userInfo.topic) {
                            this._router.navigate(['/student/topic-detail'], {
                                queryParams: {
                                    key: res.userInfo.topic,
                                },
                            });
                        } else {
                            this._router.navigateByUrl('/student');
                        }
                    }
                } else {
                    this.alert = {
                        type: 'error',
                        message: res.message,
                    };
                    if (res.accountDeactive) {
                        this.showActivateAccount = true;
                    }
                    this.showAlert = true;
                    this.signInForm.enable();
                }
            });
    }
}
