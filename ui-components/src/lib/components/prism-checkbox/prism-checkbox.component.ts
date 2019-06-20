import {Component, EventEmitter, Input, Output} from "@angular/core";

@Component({
  selector: 'prism-checkbox',
  templateUrl: './prism-checkbox.component.html',
  styleUrls: ['./prism-checkbox.component.less']
})
export class PrismCheckboxComponent {
  private _state: boolean = false;

  @Input() text: string;
  @Input() textDirection: string = 'right';

  @Input() flavor: string = 'checkbox';

  @Input('value')
  get toggleVariable(): boolean {
    return this._state;
  }

  set toggleVariable(value: boolean) {
    this._state = value;
    this.toggleVariableChange.emit(this._state);
  }

  @Output('valueChange') toggleVariableChange = new EventEmitter<boolean>();
  @Output() change = new EventEmitter<boolean>();


  constructor() {

  }

  toggleCheckbox(state: boolean): void {
    this.toggleVariable = state;
    this.change.emit(this._state);
  }


}
