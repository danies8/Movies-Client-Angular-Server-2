import {Component, OnInit, ViewChild, ElementRef, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'pm-criteria',
  templateUrl: './criteria.component.html',
  styleUrls: ['./criteria.component.css']
})
export class CriteriaComponent implements OnInit {
  @Output() valueChange: EventEmitter<string> =
    new EventEmitter<string>();

  @ViewChild('filterElement') filterElementRef: ElementRef;

  private _listFilter: string;
  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.valueChange.emit(value);
  }

  constructor() { }

  ngAfterContentInit(): void {
    setTimeout(() => {
      if (this.filterElementRef.nativeElement) {
        this.filterElementRef.nativeElement.focus();
      }
    }, 500);
  }

  ngOnInit() {
  }

}
