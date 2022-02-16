import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { AccountService } from 'app/services/account.service';
import { TopicService } from 'app/services/topics.service';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    providers: [TopicService],
})
export class ProfileComponent implements OnInit {
    profileForm: FormGroup;
    userData: any;
    loginUser: any;
    imageSrc: any = '';
    imageBaseData: string | ArrayBuffer = null;
    constructor(
        private _formBuilder: FormBuilder,
        private _toster: ToastrService,
        private _accountService: AccountService
    ) {}

    ngOnInit(): void {
        this.loginUser = AuthUtils.getUserInfo();
        this.profileForm = this._formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            profileImage: [''],
            email: ['', [Validators.required, Validators.email]],
        });
        this.getUserById(this.loginUser._id);
    }

    getUserById(userId, reload = false): void {
        this._accountService.checkUserInfoByKey(userId).subscribe((res) => {
            if (res.isSuccess) {
                localStorage.setItem('info', btoa(JSON.stringify(res.data)));
                this.profileForm.patchValue(res.data);
                this.imageBaseData =
                    res.data.profileImage &&
                    !res.data.profileImage.startsWith('http')
                        ? `${environment.apiEndpoint}/uploads/${res.data.profileImage}`
                        : res.data.profileImage;
                if (reload) {
                    window.location.reload();
                }
            }
        });
    }
    updatePtofile(): void {
        if (this.profileForm.invalid) {
            return;
        }
        const updateData = this.profileForm.value;
        this._accountService.updateUsers(updateData).subscribe((res) => {
            if (res.isSuccess) {
                this.imageBaseData = '';
                this.imageSrc = null;
                this.getUserById(this.loginUser._id, true);
                this._toster.success('Success', res.message);
            } else {
                this._toster.error('Error', res.message);
            }
        });
    }
    onFileSelected(files: any): void {
        const self = this;
        const file = files[0];
        this.imageSrc = file;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (): void => {
            self.imageBaseData = reader.result;
            this.profileForm.get('profileImage').setValue(self.imageBaseData);
        };
    }
}
