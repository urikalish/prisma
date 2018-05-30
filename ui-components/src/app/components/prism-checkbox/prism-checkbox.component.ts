import {Component, EventEmitter, Input, Output} from "@angular/core";

@Component({
  selector: 'prism-checkbox',
  templateUrl: './prism-checkbox.component.html',
  styleUrls: ['./prism-checkbox.component.less']
})
export class PrismCheckboxComponent {
  state: boolean;

  @Input() text: string;
  @Input() textDirection: string = 'right';

  @Input() flavor: string = 'checkbox';

  @Input()
  get toggleVariable() {
    return this.state;
  }

  @Output() toggleVariableChange = new EventEmitter<boolean>();
  @Output() change = new EventEmitter<boolean>();

  set toggleVariable(value) {
    this.state = value;
    this.toggleVariableChange.emit(this.state);
  }

  constructor() {

  }

  toggleCheckbox(state) {
    this.toggleVariable = state;
    this.change.emit(this.state);
  }


}
