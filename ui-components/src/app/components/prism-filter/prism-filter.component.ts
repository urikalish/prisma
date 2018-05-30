import { Component, ElementRef, EventEmitter, OnInit, Input, Output } from '@angular/core';

@Component({
  selector: 'prism-filter',
  templateUrl: './prism-filter.component.html',
  styleUrls: ['./prism-filter.component.less']
})
export class PrismFilterComponent implements OnInit {

  private _filtersList: Array<any>;
  private _filtersValues: Array<any>;
  private _selectedFilters: Array<any>;

  private _newFilterField;
  private _newFilterValue;

  private _addingNewFilter = false;

  @Input()
  set filtersList(array: Array<any>) {
    if (!array) {
      this._filtersList = [];
    } else {
      this._filtersList = array;
    }
  }

  @Input()
  set filterValues(array: Array<any>) {
    if (!array) {
      this._filtersValues = [];
    } else {
      this._filtersValues = array;
    }
  }

  @Input()
  set selectedFilters(array: Array<any>)
  {
    if (!array) {
      this._selectedFilters = [];
    } else {
      this._selectedFilters = array;
    }
  }

  @Output() onNewFilter = new EventEmitter<any>();
  @Output() onFieldSelected = new EventEmitter<any>();
  @Output() onFiltersChanged = new EventEmitter<any>();

  constructor(private element: ElementRef) {
  }

  ngOnInit() {
    if (!this._selectedFilters) {
      this._selectedFilters = [];
    }
  }

  addNewFilter() {
    this._addingNewFilter = true;
    this.onNewFilter.emit(true);
  }

  resetNewFilter(){
    this._addingNewFilter = false;
    this._newFilterField = null;
  }

  selectFieldForNewFilter(field) {
    this._newFilterField = field;
    this.onFieldSelected.emit(field);
  }

  selectValueForNewFilter(value) {
    this._newFilterValue = value;

    let newFilter = {
      field: this._newFilterField,
      value: this._newFilterValue
    };

    this._newFilterValue = null;
    this._newFilterField = null;

    this._selectedFilters.push(newFilter);
    this.onFiltersChanged.emit(this._selectedFilters);

    this._addingNewFilter = false;
  }

  removeFilter(index) {
    this._selectedFilters.splice(index, 1);
    this.onFiltersChanged.emit(this._selectedFilters);
  }

  onKeyPress($event) {
    switch($event.keyCode) {
      //esc
      case 27:
        // $event.stopPropagation();

        // if (this._addingNewFilter && !this._newFilterField) {
        //   this._addingNewFilter = false;
        // }
        // else if (this._addingNewFilter && !!this._newFilterField) {
        //   this._newFilterField = null;
        // }

        if (this._addingNewFilter) {
          this.resetNewFilter();
        }

        break;
    }
  }
}
