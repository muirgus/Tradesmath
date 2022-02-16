import { Injectable } from '@angular/core';
import { assign, cloneDeep } from 'lodash-es';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { user as userData } from 'app/mock-api/common/user/data';

@Injectable({
    providedIn: 'root',
})
export class UserMockApi {
    private _user: any = userData;

    /**
     * Constructor
     */
    constructor(private _fuseMockApiService: FuseMockApiService) {
        // Register Mock API handlers
        this.registerHandlers();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void {
        // -----------------------------------------------------------------------------------------------------
        // @ User - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService.onGet('api/common/user').reply(() => {
            // test
            if (localStorage.getItem('info')) {
                const userInfo = JSON.parse(atob(localStorage.getItem('info')));
                return [200, cloneDeep(userInfo)];
            } else {
                localStorage.clear();
                window.location.reload(true);
                return [200, {}];
            }
        });

        // -----------------------------------------------------------------------------------------------------
        // @ User - PATCH
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPatch('api/common/user')
            .reply(({ request }) => {
                // Get the user mock-api
                const user = cloneDeep(request.body.user);

                // Update the user mock-api
                this._user = assign({}, this._user, user);

                // Return the response
                return [200, cloneDeep(this._user)];
            });
    }
}
