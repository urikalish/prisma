import {AfterViewInit, Component, EventEmitter, Input, Output, ViewChild} from "@angular/core";
import {PrismInputComponent} from "../prism-input/prism-input.component";
import {PrismListComponent} from "../prism-dropdown-components/prism-list/prism-list.component";
import {ItemDisplayNamePipe} from "./item-display-name.pipe";
import {isNullOrUndefined} from "util";

@Component({
  selector: 'prism-filterable-list',
  templateUrl: './prism-filterable-list.component.html',
  styleUrls: ['./prism-filterable-list.component.less']
})
export class PrismFilterableListComponent implements AfterViewInit {
  private _multiSelection: Array<any> = [];

  isVisible: boolean = false;
  isNewItemVisible: boolean = false;

  @Input() query: string = '';
  @Input() allowNewItem: boolean = false;
  @Input() allowLoadingItem: boolean = true;
  @Input() hideList: boolean = false;
  @Input() placeholder: string = "Search";
  @Input() openList: string = "bottom"; // bottom or top
  @Input() queryKey: string;
  @Input() items: Array<any> = null;
  @Input() focus: boolean = false;
  @Input() multi: boolean = false;

  @Input()
  set multiSelected(value: Array<any>) {
    this._multiSelection = value;
  }

  @Output() onItemSelected = new EventEmitter<any>();
  @Output() onNewItem = new EventEmitter<string>();
  @Output() multiSelectedChange = new EventEmitter<any>();
  @Output() onVisible = new EventEmitter<boolean>();
  @Output() onQueryChange = new EventEmitter<string>();

  @ViewChild(PrismInputComponent, {read: PrismInputComponent}) inputRef: PrismInputComponent;
  @ViewChild(PrismListComponent, {read: PrismListComponent}) listRef: PrismListComponent;

  constructor(private itemDisplayName: ItemDisplayNamePipe) {
  }

  ngAfterViewInit() {
    this.focusInput();
  }

  queryChanged(query: string) {
    if (isNullOrUndefined(query)) {
      this.query = '';
    }

    if (this.query !== query) {
      this.query = query.trim();
      this.showAddButtonOnChange();
      this.onQueryChange.emit(this.query);
    }
  }

  showAddButtonOnChange(showContent: boolean = true) {
    this.isVisible = showContent;
    this.isNewItemVisible = this.allowNewItem && this.query.length > 0 && !this.isQueryFoundInItems(this.query);
  }

  isQueryFoundInItems(query: string): boolean {
    if (isNullOrUndefined(query) || isNullOrUndefined(this.items)) {
      return false;
    }

    return this.items.some((item) => {
      return this.getItemText(item).toLowerCase() === query.trim().toLowerCase();
    });
  }

  focusInput() {

    if (this.focus && !!this.inputRef) {
      this.inputRef.inputRef.nativeElement.focus();
    } else if (this.focus) {
      this.listRef.listRef.nativeElement.focus();
    }
  }

  newItemSelected($event: Event) {
    $event.stopPropagation();
    this.isVisible = false;
    this.isNewItemVisible = false;
    this.onNewItem.emit(this.query);
  }

  itemSelected(item: any) {
    if (this.multi) {
      return;
    }
    // $event.stopPropagation();
    this.query = this.getItemText(item);
    this.showAddButtonOnChange(false);
    this.isVisible = false;
    this.onItemSelected.emit(item);
  }

  itemMultiSelected(item: any) {
    if (!this.multi) {
      return;
    }

    let itemIndex;

    if ((itemIndex = this._multiSelection.indexOf(item)) === -1) {
      this._multiSelection.push(item);
    } else {
      this._multiSelection.splice(itemIndex, 1);
    }

    this.multiSelectedChange.emit(this._multiSelection);
  }

  getItemText(item: any): string {
    return this.itemDisplayName.transform(item, this.queryKey).trim();
  }

  setVisible(visible: boolean) {
    this.isVisible = visible;
    if (this.isVisible) {
      this.onVisible.emit(this.isVisible);
    }
  }
}
