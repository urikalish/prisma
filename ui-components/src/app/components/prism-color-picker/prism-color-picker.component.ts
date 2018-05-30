import {Component, Input, OnInit} from "@angular/core";

@Component({
  selector: 'prism-color-picker',
  templateUrl: './prism-color-picker.component.html',
  styleUrls: ['./prism-color-picker.component.less'],
})
export class PrismColorPickerComponent implements OnInit {

  @Input() colors: Array<string>;
  @Input() selectedIndex: number = 0;

  constructor() {
  }

  ngOnInit() {
  }

}
