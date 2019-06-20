import {Component, ElementRef, forwardRef, Input, ViewChild} from "@angular/core";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

const noop = () => {
};

@Component({
  selector: 'prism-input',
  templateUrl: './prism-input.component.html',
  styleUrls: ['./prism-input.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PrismInputComponent),
      multi: true,
    }
  ],
  // changeDetection: ChangeDetectionStrategy.OnPush
  // encapsulation: ViewEncapsulation.None
})
export class PrismInputComponent implements ControlValueAccessor {
  @ViewChild('input') inputRef: ElementRef;
  @Input() placeholder: string;

  //The internal data model
  private innerValue: any = '';

  //Placeholders for the callbacks which are later provides
  //by the Control Value Accessor
  @Input() onTouchedCallback: () => void = noop;
  @Input() onChangeCallback: (_: any) => void = noop;

  //get accessor
  get value(): any {
    return this.innerValue;
  };

  //set accessor including call the onchange callback
  set value(v: any) {
    if (v !== this.innerValue) {
      this.innerValue = v;
      this.onChangeCallback(v);
    }
  }

  //From ControlValueAccessor interface
  writeValue(value: any) {
    this.value = value;
    // if (value !== this.innerValue) {
    //   this.innerValue = value;
    // }
  }

  //From ControlValueAccessor interface
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  //From ControlValueAccessor interface
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }
}
