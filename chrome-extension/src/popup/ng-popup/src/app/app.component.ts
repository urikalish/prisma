import {Component} from "@angular/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'Prism';
  highlightColors = ['#00a0dc', '#8d6cab', '#dd5143', '#e68523', '#edb220', '#7cb82f'];

  coveragePresets = [
    {
      label: 'Overall test coverage',
      options: {
        production: false,
        automation: true,
        manual: true
      }
    },
    {
      label: 'Automated test coverage',
      options: {
        production: false,
        automation: true,
        manual: false
      }
    },
    {
      label: 'Manual test coverage',
      options: {
        production: false,
        automation: false,
        manual: true
      }
    },
    {
      label: 'covered in manual testing, not covered in automation',
      options: {
        production: false,
        automation: true,
        manual: true
      }
    },
    {
      label: 'Used in production, not covered in testing',
      options: {
        production: true,
        automation: true,
        manual: true
      }
    },
    {
      label: 'Used in production',
      options: {
        production: true,
        automation: false,
        manual: false
      }
    }
  ];

  coverageToggle = false;
  colorToggle = false;
  showCoverage = true;
  
  selectedPreset = this.coveragePresets[0];
  selectedColor = this.highlightColors[0];
}
