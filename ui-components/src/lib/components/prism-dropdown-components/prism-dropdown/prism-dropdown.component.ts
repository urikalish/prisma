import {AfterContentInit, Component, ContentChildren, ElementRef, Input, QueryList, Renderer2} from "@angular/core";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {PrismListItemComponent} from "../prism-list-item/prism-list-item.component";

@Component({
  selector: 'prism-dropdown',
  templateUrl: './prism-dropdown.component.html',
  styleUrls: ['./prism-dropdown.component.less']
})
export class PrismDropdownComponent implements AfterContentInit {
  private _wasSelectedByIndex: boolean;

  private _selectedIndex: number;
  private _itemsEvents: Array<Function> = [];

  public selectedElement: SafeHtml;
  public isOpened: boolean = false;

  @Input() displayedLabel: string;

  @Input()
  set selectedIndex(value: number) {
    this._wasSelectedByIndex = false;
    this._selectedIndex = value;
    this.selectItemByIndex(value);
  };

  get selectedIndex(): number {
    return this._selectedIndex;
  }

  @ContentChildren(PrismListItemComponent, {
    read: PrismListItemComponent,
    descendants: true
  }) itemsContext: QueryList<PrismListItemComponent>;

  @ContentChildren(PrismListItemComponent, {
    read: ElementRef,
    descendants: true
  }) itemsElementRef: QueryList<ElementRef>;

  constructor(private sanitizer: DomSanitizer, private renderer: Renderer2) {
  }

  toggleTo(state: boolean) {
    if (this.isOpened !== state) {
      this.isOpened = state;
    }
  }

  toggle() {
    this.toggleTo(!this.isOpened);
  }

  selectItemByIndex(index: number) {
    if (!isNaN(index) && !!this.itemsContext && !!this.itemsContext.toArray()[index]) {
      let elem = this.itemsContext.toArray()[index].itemRef.nativeElement;
      this._selectedIndex = index;
      this._wasSelectedByIndex = true;
      this.selectItemByElement(elem);
    }
  }

  selectItemByElement(elem: HTMLElement) {
    this.selectedElement = this.sanitizer.bypassSecurityTrustHtml(elem.innerHTML);
  }

  ngAfterContentInit() {
    this.listenToItemsClick();
    this.selectItemByIndex(this.selectedIndex);

    this.itemsElementRef.changes.subscribe(() => {
      this.listenToItemsClick();

      if (!this._wasSelectedByIndex) {
        this.selectItemByIndex(this._selectedIndex);
      }
    });
    // console.log(this.itemsElementRef, this.itemsContext);
  }

  listenToItemsClick(): void {
    //remove previous listeners if there are any
    this._itemsEvents.forEach(removeListener => removeListener());

    this._itemsEvents = [];

    // register click event for all items in dropdown
    this.itemsElementRef.forEach((item: ElementRef, index: number) => {
      // console.log('listen to click');

      this._itemsEvents.push(this.renderer.listen(item.nativeElement, 'click', ($event) => {
        // if selected by outer source, used to prevent multiple events from keys
        if ($event.screenX === 0 && $event.screenY === 0) {
          $event.stopPropagation();
        }

        this.selectItemByIndex(index);
      }));
    });
  }
}
