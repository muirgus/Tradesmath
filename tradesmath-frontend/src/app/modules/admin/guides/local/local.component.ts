import { Component, OnInit } from '@angular/core';
import { GuidesComponent } from '../guides.component';

@Component({
  selector: 'app-local',
  templateUrl: './local.component.html',
  styleUrls: ['./local.component.scss']
})
export class LocalComponent {

  constructor(private _guidesComponent: GuidesComponent)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle the drawer
     */
    toggleDrawer(): void
    {
        // Toggle the drawer
        this._guidesComponent.matDrawer.toggle();
    }

}
