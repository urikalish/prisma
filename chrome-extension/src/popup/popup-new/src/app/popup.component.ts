import {Component} from '@angular/core';

@Component({
  selector: 'popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.less'],
})
export class PopupComponent {

  showCoverage = true;
  colors = ['#caaad1', '#3eccfd', '#73dd54', '#fcb354', '#fccf27'];

  filtersList;

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

  coveragePresets = [
    {
      label: 'Overall test coverage',
      options: {
        production: false,
        automation: true,
        manual: true
      },
      coverage: {
        production: false,
        automation: true,
        manual: true
      },
      filters: ''
    },
    {
      label: 'Automated test coverage',
      options: {
        production: false,
        automation: true,
        manual: false
      },
      coverage: {
        production: false,
        automation: true,
        manual: false
      },
      filters: ''
    },
    {
      label: 'Manual test coverage',
      options: {
        production: false,
        automation: false,
        manual: true
      },
      coverage: {
        production: false,
        automation: false,
        manual: true
      },
      filters: ''
    },
    {
      label: 'Covered in manual testing, not covered in automation',
      options: {
        production: false,
        automation: true,
        manual: true
      },
      coverage: {
        production: false,
        automation: false,
        manual: true
      },
      filters: ''
    },
    {
      label: 'Used in production, not covered in testing',
      options: {
        production: true,
        automation: true,
        manual: true
      },
      coverage: {
        production: true,
        automation: false,
        manual: false
      },
      filters: ''
    },
    {
      label: 'Used in production',
      options: {
        production: true,
        automation: false,
        manual: false
      },
      coverage: {
        production: true,
        automation: false,
        manual: false
      },
      filters: ''
    },
    {
      label: 'Custom preset',
      options: {
        production: true,
        automation: true,
        manual: false
      },
      coverage: {
        production: true,
        automation: false,
        manual: false
      },
      filters: {
        production: this.selectedFilters,
        automation: this.selectedFilters,
        manual: ''
      }
    }
  ];

  selectedPreset: any = this.coveragePresets[0];
  coverageSettings = [
    {
      text: 'Manual tests',
      stateField: 'manual'
    },
    {
      text: 'Automated tests',
      stateField: 'automation'
    },
    {
      text: 'Production usage',
      stateField: 'production'
    }
  ];

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

  onPresetSelected(preset: any) {
    this.selectedPreset = preset;
  }
}
