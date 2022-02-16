import { Component } from '@angular/core';

@Component({
    selector: 'app-logout',
    templateUrl: './logout.component.html',
})
export class LogoutComponent {
    constructor() {}

    logoutUser(): void {
        localStorage.clear();
        window.location.reload(true);
    }
}
