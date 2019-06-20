import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {isNullOrUndefined} from "util";

@Component({
  selector: 'prism-filter',
  templateUrl: './prism-filter.component.html',
  styleUrls: ['./prism-filter.component.less']
})
export class PrismFilterComponent implements OnInit {

  public _filtersList: Array<any>;
  public _filtersValues: Array<any>;
  public _selectedFilters: Array<any>;

  public _newFilterField: any;
  public _newFilterValue: any;

  public _addingNewFilter = false;

  @Input() multi: boolean = false;
  @Input() preventDuplicates = true;

  @Input()
  set filtersList(array: Array<any>) {
    if (!array) {
      this._filtersList = [];
    } else {
      this._filtersList = array;
    }
  }

  get filtersList(): Array<any> {
    if (this.preventDuplicates) {
      return this._filtersList.filter((allItem) => {
        return isNullOrUndefined(this._selectedFilters) ? true : this._selectedFilters.every(selectedItem => {
          return !this.isTheSameFilter(selectedItem.field, allItem);
        })
      });
    } else {
      return this._filtersList;
    }
  }

  @Input()
  set filterValues(array: Array<any>) {
    // if (!array) {
    //   this._filtersValues = [];
    // } else {
    //   this._filtersValues = array;
    // }
    this._filtersValues = array;
  }

  @Input()
  set selectedFilters(array: Array<any>) {
    if (!array) {
      this._selectedFilters = [];
    } else {
      this._selectedFilters = array;
    }
  }

  @Output() onNewFilter = new EventEmitter<any>();
  @Output() onFieldSelected = new EventEmitter<any>();
  @Output() onFiltersChanged = new EventEmitter<any>();

  constructor() {
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

  resetNewFilter() {
    if (this._addingNewFilter) {
      this._addingNewFilter = false;
      this._newFilterField = null;
    }
  }

  selectFieldForNewFilter(field: any) {
    this._newFilterField = field;
    this.onFieldSelected.emit(field);
  }

  selectValueForNewFilter(value: any) {
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

  selectValueForNewMultiFilter(value: any) {
    this._newFilterValue = value;
  }

  acceptMultiSelection() {
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

  removeFilter(index: number) {
    this._selectedFilters.splice(index, 1);
    this.onFiltersChanged.emit(this._selectedFilters);
  }

  isTheSameFilter(filter1, filter2): boolean {
    const keys = Object.keys(filter1);

    return keys.some(key => {
      return filter1[key] === filter2[key];
    });
  }
}
