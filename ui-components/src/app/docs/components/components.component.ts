import {Component, OnInit} from "@angular/core";

@Component({
  selector: 'prism-components',
  templateUrl: './components.component.html',
  styleUrls: ['./components.component.less']
})
export class ComponentsComponent implements OnInit {

  clicked() {
    alert("hello");
  }

  onItemSelected(value: string) {
    alert(value);
  }

  // addColor() {
  //   this.colors.push("#3cb82f");
  // }
  //
  // removeColor() {
  //   this.colors.pop();
  // }


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

  constructor() {
  }

  ngOnInit() {
  }

}
