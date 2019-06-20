import {
  AfterContentInit,
  ContentChildren,
  Directive,
  ElementRef,
  HostListener,
  Input,
  QueryList,
  Renderer2
} from "@angular/core";
import {PrismListItemComponent} from "../../components/prism-dropdown-components/prism-list-item/prism-list-item.component";

@Directive({
  selector: '[prismListNavigation]'
})
export class ListNavigationDirective implements AfterContentInit {

  private currentIndex: number = -1;
  private eventListeners: Array<Function> = [];
  private lastActiveItem: ElementRef = null;

  @Input() itemClassWhenActive: string = 'active';
  @Input() stayOnItemAfterSelection: boolean = false;

  @ContentChildren(PrismListItemComponent, {
    read: ElementRef,
    descendants: true
  }) items: QueryList<ElementRef>;

  @HostListener('keydown.arrowup', ['$event'])
  onKeyUp($event: Event) {
    this.blurCurrentItem();

    if (!this.isEnabled()) {
      return;
    }

    $event.preventDefault();

    if (--this.currentIndex < 0) {
      this.currentIndex = this.items.length - 1;
    }

    this.focusItem(true);
  }

  @HostListener('keydown.arrowdown', ['$event'])
  onKeyDown($event: Event) {
    this.blurCurrentItem();

    if (!this.isEnabled()) {
      return;
    }

    $event.preventDefault();

    if (++this.currentIndex >= this.items.length) {
      this.currentIndex = 0;
    }

    this.focusItem(true);
  }

  @HostListener('keydown.enter', ['$event'])
  @HostListener('keydown.space', ['$event'])
  onKeyEnter($event: Event) {
    if (this.currentIndex > -1) {
      // $event.stopPropagation();
      this.clickCurrentItem();
    }
  }

  constructor(private renderer: Renderer2) {
  }

  blurCurrentItem() {
    const item = this.items.toArray()[this.currentIndex];

    if (!!item) {
      this.renderer.removeClass(item.nativeElement, this.itemClassWhenActive);
    }

    if (!!this.lastActiveItem) {
      this.renderer.removeClass(this.lastActiveItem.nativeElement, this.itemClassWhenActive);
      this.lastActiveItem = null;
    }
  }

  focusItem(withScroll: boolean = false) {
    const item = this.items.toArray()[this.currentIndex];

    if (!!item) {
      this.lastActiveItem = item;
      this.renderer.addClass(item.nativeElement, this.itemClassWhenActive);

      if (withScroll) {
        this.scrollToItem(item);
      }
    }
  }

  clickCurrentItem() {
    const item = this.items.toArray()[this.currentIndex];

    if (!!item && !this.isItemElementDisabled(item)) {

      if (!this.stayOnItemAfterSelection) {
        this.blurCurrentItem();
        this.currentIndex = -1;
      }

      item.nativeElement.click();
    }
  }

  scrollToItem(item: ElementRef): void {
    item.nativeElement.scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'nearest'});
  }

  /**
   * Check if list items are rendered in DOM or not
   * @return enabled status
   */
  isEnabled(): boolean {
    if (this.items.length > 0) {
      let item = this.items.toArray()[0].nativeElement;

      return item.isConnected || item.canHaveHTML;
    } else {
      return false;
    }
  }


  isItemElementDisabled(item: ElementRef): boolean {
    return getComputedStyle(item.nativeElement, null).pointerEvents === 'none';
  }

  ngAfterContentInit() {
    this.listenToItemsClick();

    this.items.changes.subscribe(() => {
      this.blurCurrentItem();
      this.currentIndex = -1;
      this.listenToItemsClick();
    });
  }

  listenToItemsClick(): void {
    // Removes the old listeners
    this.eventListeners.forEach((listener: Function) => listener());

    this.eventListeners = [];

    this.items.forEach((item: ElementRef, index: number) => {
      this.eventListeners.push(this.renderer.listen(item.nativeElement, 'mouseenter', () => {
        this.blurCurrentItem();
        this.currentIndex = index;
        this.focusItem();
      }));

      this.eventListeners.push(this.renderer.listen(item.nativeElement, 'mouseleave', () => {
        this.blurCurrentItem();
        this.currentIndex = -1;
      }));

    });
  }
}
