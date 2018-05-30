import {AfterContentInit, Component, ContentChildren, ElementRef, Input, Renderer2} from "@angular/core";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {PrismListItemComponent} from "../prism-list-item/prism-list-item.component";

@Component({
  selector: 'prism-dropdown',
  templateUrl: './prism-dropdown.component.html',
  styleUrls: ['./prism-dropdown.component.less']
})
export class PrismDropdownComponent implements AfterContentInit {
  private itemsEvents = [];

  public selectedElement: SafeHtml;
  public isOpened: boolean = false;

  @Input() displayedLabel: string;
  @Input() selectedIndex: number;

  @ContentChildren(PrismListItemComponent, {
    read: PrismListItemComponent,
    descendants: true
  }) itemsContext;

  @ContentChildren(PrismListItemComponent, {
    read: ElementRef,
    descendants: true
  }) itemsElementRef;

  constructor(private sanitizer: DomSanitizer, private renderer: Renderer2) {
  }

  toggleTo(state: boolean) {
    this.isOpened = state;
    // console.log('toggle: ', state);
  }

  toggle() {
    this.toggleTo(!this.isOpened);
  }

  selectItemByIndex(index) {
    if (!isNaN(index)) {
      this.selectedIndex = index;
      let elem = this.itemsContext.toArray()[index].itemRef.nativeElement;
      this.selectItemByElement(elem);
    }
  }

  selectItemByElement(elem) {
    this.selectedElement = this.sanitizer.bypassSecurityTrustHtml(elem.innerHTML);
  }

  ngAfterContentInit() {
    this.selectItemByIndex(this.selectedIndex);

    this.listenToItemsClick();

    this.itemsElementRef.changes.subscribe(() => {
      this.listenToItemsClick();
    });
    // console.log(this.itemsElementRef, this.itemsContext);
  }

  listenToItemsClick(): void {
    this.itemsEvents.forEach(removeListener => {
      //remove previous listeners if there are any
      // console.log('remove listener');
      removeListener();
    });


    this.itemsEvents = [];

    // register click event for all items in dropdown
    this.itemsElementRef.forEach((item, index) => {
      // console.log('listen to click');

      this.itemsEvents.push(this.renderer.listen(item.nativeElement, 'click', ($event) => {
        // if selected by outer source, used to prevent multiple events from keys
        if ($event.screenX === 0 && $event.screenY === 0) {
          $event.stopPropagation();
        }

        this.selectItemByIndex(index);
      }));
    });
  }
}
