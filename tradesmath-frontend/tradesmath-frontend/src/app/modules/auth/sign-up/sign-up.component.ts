/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable quotes */
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { Invitations } from 'app/models/invitations';
import { Users } from 'app/models/users';
import { AccountService } from 'app/services/account.service';
import { InvitationService } from 'app/services/invitations.service';

@Component({
    selector: 'auth-sign-up',
    templateUrl: './sign-up.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    providers: [AccountService],
})
export class AuthSignUpComponent implements OnInit {
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    signUpForm: FormGroup;
    showAlert: boolean = false;
    invitationId: string = '';
    invitationUserInfo: Invitations;

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _accountService: AccountService,
        private _invitationService: InvitationService,
        private _activatedRoute: ActivatedRoute
    ) {}

    get isAdminPath(): boolean {
        return window.location.pathname === '/admin/registration';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.signUpForm = this._formBuilder.group({
            firstName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            confirmPassword: ['', Validators.required],
            lastName: ['', Validators.required],
            agreements: [''],
        });

        if (this.isAdminPath) {
            this.invitationId =
                this._activatedRoute.snapshot.queryParams['key'];
            this._invitationService
                .checkInvitationInfo(this.invitationId)
                .subscribe((invitation) => {
                    if (invitation.isSuccess) {
                        const userInvitation = {
                            ...invitation.data,
                            key: invitation.data._id,
                        } as Invitations;
                        this.invitationUserInfo = userInvitation;
                        this.signUpForm
                            .get('email')
                            .setValue(userInvitation.email);
                        this.signUpForm
                            .get('firstName')
                            .setValue(userInvitation.name);
                        if (!userInvitation.isValid) {
                            this.alert = {
                                type: 'error',
                                message:
                                    "This invitation is expired, you can't signup using this",
                            };

                            this.showAlert = true;
                            this.signUpForm.disable();
                        }
                    } else {
                        this.alert = {
                            type: 'error',
                            message: "No invitation found, you can't signup",
                        };
                        this.showAlert = true;
                        this.signUpForm.disable();
                    }
                });
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign up
     */
    signUp(): void {
        // Do nothing if the form is invalid
        if (this.signUpForm.invalid) {
            return;
        }

        // Disable the form
        this.signUpForm.disable();

        // Hide the alert
        this.showAlert = false;
        const userInfo = this.signUpForm.value as any;
        userInfo.confirmPassword = userInfo.confirmPassword;
        userInfo.password = userInfo.password;
        userInfo.isActive = true;
        userInfo.isAdmin = false;
        userInfo.isSuperAdmin = false;
        userInfo.email = userInfo.email.toLowerCase();
        if (
            this.isAdminPath &&
            this.invitationUserInfo &&
            this.invitationUserInfo.invitationId
        ) {
            userInfo.invitedBy = this.invitationUserInfo.invitationId;
            userInfo.isAdmin = true;
            userInfo.isActive = true;
        }
        userInfo.isActive = false;
        this._accountService.signUp(userInfo).subscribe(
            (res) => {
                if (res.isSuccess) {
                    if (
                        this.isAdminPath &&
                        this.invitationUserInfo &&
                        this.invitationUserInfo.key
                    ) {
                        this.invitationUserInfo.isValid = false;
                        this._invitationService
                            .updateInvitation({
                                invitationId: this.invitationId,
                            })
                            .subscribe((invite) => {});
                    }
                    if (!userInfo.isActive) {
                        this._router.navigateByUrl('/activation');
                    } else {
                        this._router.navigateByUrl('/sign-in');
                    }
                    this.signUpForm.enable();
                    this.signUpForm.reset();
                } else {
                    this.alert = {
                        type: 'error',
                        message: res.message,
                    };
                    this.showAlert = true;
                    this.signUpForm.enable();
                }
            },
            () => {
                this.alert = {
                    type: 'error',
                    message: 'Failed to register, please try again',
                };
                this.showAlert = true;
                this.signUpForm.enable();
            }
        );
    }
}
