/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'app/services/account.service';
import { ToastrService } from 'ngx-toastr';
import * as FileSaver from 'file-saver';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {
    usersList: any = [];
    excelList: any = [];
    displayedColumns: string[] = [
        'index',
        'firstName',
        'lastName',
        'email',
        'userType',
        'key',
    ];
    filterColummn: string[] = [
        'index',
        'firstName',
        'lastName',
        'email',
        'userType',
    ];
    showFilter: boolean = false;
    userDatalist: any = [];
    constructor(
        private _accountService: AccountService,
        private _toastrService: ToastrService,
        private _route: Router
    ) {}
    ngOnInit(): void {
        this.getUsersList();
    }
    exportExcel(): void {
        this.excelList = this.userDatalist.map((x: any) => ({
            Index: x.index,
            'First Name': x.firstName,
            'Last Name': x.lastName,
            Email: x.email,
            'User Type': x.userType,
        }));
        if (this.excelList.length > 0) {
            import('xlsx').then((xlsx) => {
                const worksheet = xlsx.utils.json_to_sheet(this.excelList);
                const workbook = {
                    Sheets: { data: worksheet },
                    SheetNames: ['data'],
                };
                const excelBuffer: any = xlsx.write(workbook, {
                    bookType: 'xlsx',
                    type: 'array',
                });
                this.saveAsExcelFile(excelBuffer, 'ExportExcel');
            });
        }
    }

    saveAsExcelFile(buffer: any, fileName: string): void {
        const EXCEL_TYPE =
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE,
        });
        FileSaver.saveAs(
            data,
            fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
        );
    }
    getUsersList(): void {
        this._accountService.getUsersList().subscribe((res) => {
            if (res.isSuccess) {
                const usersList = [];
                res.data.forEach((result: any, counter: number) => {
                    usersList.push({
                        index: counter + 1,
                        ...result,
                        key: result['_id'],
                        userType: '',
                    });
                });
                usersList.forEach((element) => {
                    element.userType = element.isSuperAdmin
                        ? 'Super Admin'
                        : element.isAdmin
                        ? 'Admin'
                        : 'Student';
                });
                this.usersList = usersList;
                this.userDatalist = usersList;
                this.showFilter = true;
            }
        });
    }

    editUser(payload: any): void {
        this._route.navigate(['/app/users-details'], {
            queryParams: {
                key: payload.key,
            },
        });
    }

    deleteQuestions(payload: any): void {
        if (confirm('Are you sure you want to delete it?')) {
            this._accountService.deleteUsers(payload.key).subscribe((res) => {
                if (res.isSuccess) {
                    this.getUsersList();
                    this._toastrService.success('User deleted successfully');
                } else {
                    this._toastrService.success('Failed to delete users');
                }
            });
        }
    }

    GetFilteredData(event): void {
        this.userDatalist = event;
    }
}
