import {Component, OnInit} from "@angular/core";

@Component({
  selector: 'prism-checkboxes',
  templateUrl: './checkboxes.component.html',
  styleUrls: ['./checkboxes.component.less']
})
export class CheckboxesComponent implements OnInit {

  checkboxes = {
    checkbox: {
      default: false,
      checked: true,
      left: false,
      disabled: false,
      noText: false
    },
    round: {
      default: false,
      checked: true,
      left: false,
      disabled: false,
      noText: false
    },
    square: {
      default: false,
      checked: true,
      left: false,
      disabled: false,
      noText: false
    }
  };

  constructor() {
  }

  ngOnInit() {
  }

}
