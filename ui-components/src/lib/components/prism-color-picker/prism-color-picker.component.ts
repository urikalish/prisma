import {Component, EventEmitter, Input, Output} from "@angular/core";

@Component({
  selector: 'prism-color-picker',
  templateUrl: './prism-color-picker.component.html',
  styleUrls: ['./prism-color-picker.component.less'],
})
export class PrismColorPickerComponent {

  @Input() colors: Array<string>;
  @Input() selectedIndex: number = 0;

  @Output() onColorSelected = new EventEmitter<number>();

  constructor() {
  }

  changeColor(colorIndex: number) {
    this.onColorSelected.emit(colorIndex);
  }

}
