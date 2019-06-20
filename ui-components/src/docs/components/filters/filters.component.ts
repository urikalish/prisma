import {Component, OnInit} from "@angular/core";

@Component({
  selector: 'prism-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.less']
})
export class FiltersComponent implements OnInit {

  dropdownValues = [
    {
      icon: "passed",
      label: "Passedddddddddddddddddddddddddddddd",
      value: "passed"
    },
    {
      icon: "plus",
      label: "Plus",
      value: "plus"
    },
    {
      icon: "down",
      label: "Down",
      value: "down"
    },
    {
      icon: "up",
      label: "Up",
      value: "up"
    },
    {
      icon: "failed",
      label: "Failed",
      value: "failed"
    }
  ];

  filtersList;

  multiListSelected = [this.dropdownValues[1], this.dropdownValues[2]];

  filtersCurrentValues;

  filtersValues = {
    date: ['Past 24 hours', 'Past week', 'Past month', 'Past year', 'Costume'],
    session: ['Session 1', 'Session 2', 'Session 3'],
    release: ['Release 1', 'Release 2', 'Release 3']
  };

  dateField = {
    label: 'Date',
    value: 'date',
    type: 'date'
  };

  sessionField = {
    label: 'Session',
    value: 'session',
    type: 'list'
  };

  releaseField = {
    label: 'Release',
    value: 'release',
    type: 'list'
  };

  selectedFilters = [
    {
      field: this.dateField,
      value: 'Past week'
    },
    {
      field: this.sessionField,
      value: 'Session 3'
    }
  ];

  constructor() {
  }

  ngOnInit() {
  }

  onFieldSelected(field) {
    this.filtersCurrentValues = this.filtersValues[field.value];
  }

  onFiltersChanged(filtersArray) {
    console.log('from app, selected filters:', filtersArray);
  }

  getFieldsList() {
    this.filtersList = [
      this.dateField, this.sessionField, this.releaseField
    ];
  }
}
