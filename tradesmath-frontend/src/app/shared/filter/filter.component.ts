import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {
  @Input() data: any = [];
  @Input() columns: any[];
  @Output() outputData: EventEmitter<any> = new EventEmitter();

  filteredData: any = [];

  constructor() { }

  ngOnInit(): void { }

  filter(event): void {
    this.filteredData = [];
    const value = event.target.value;
    if (value) {
      this.data.forEach((element) => {
        let isAdded = false;
        this.columns.forEach((column) => {
          if (element[column] && !isAdded) {
            if (
              String(element[column])
                .toLowerCase()
                .includes(value.toLowerCase())
            ) {
              isAdded = true;
              this.filteredData.push(element);
            }
          }
        });
      });
    } else {
      this.filteredData = this.data;
    }
    this.outputData.emit(this.filteredData);
  }
}
