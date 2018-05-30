import {AfterViewChecked, Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation} from "@angular/core";
import {PrismInputComponent} from "../prism-input/prism-input.component";
import {PrismListComponent} from "../prism-dropdown-components/prism-list/prism-list.component";

@Component({
  selector: 'prism-filterable-list',
  templateUrl: './prism-filterable-list.component.html',
  styleUrls: ['./prism-filterable-list.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class PrismFilterableListComponent implements AfterViewChecked {

  @Input() allowNewItem: boolean = false;
  @Input() hideList: boolean = false;
  @Input() placeholder: string = "Search";
  @Input() openList: string = "bottom"; // bottom or top
  @Input() queryKey: string;
  @Input() query: string;
  @Input() items: any;
  @Input() focus: boolean = false;
  @Output() onItemSelected = new EventEmitter<string>();

  isVisible: boolean = false;

  @ViewChild(PrismInputComponent, {read: PrismInputComponent}) inputRef;
  @ViewChild(PrismListComponent, {read: PrismListComponent}) listRef;

  ngAfterViewChecked() {
    this.focusInput();
  }

  focusInput() {

    if (this.focus && !!this.inputRef) {
      this.inputRef.inputRef.nativeElement.focus();
    } else if (this.focus) {
      this.listRef.listRef.nativeElement.focus();
    }
  }

  newItemSelected() {
    this.isVisible = false;
    this.onItemSelected.emit(this.queryKey);
  }

  itemSelected(item: any) {
    this.isVisible = false;
    this.query = !!this.queryKey ? item[this.queryKey] : item;
    this.onItemSelected.emit(item);
  }
}
