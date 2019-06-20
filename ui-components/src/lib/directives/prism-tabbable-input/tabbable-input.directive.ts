import {Directive, ElementRef, HostBinding, HostListener} from "@angular/core";

/**
 * A directive that can be used to turn any DOM element to a tabbable element.
 * When this directive is applied on a DOM element, this element can be reached
 * by pressing the <TAB> key (as a part of the TAB flow).
 * When the element is both focused &
 */

@Directive({
  selector: '[prismTabbableInput]',
})
export class TabbableInputDirective {
  @HostBinding('tabindex') tabindex = 0;

  constructor(private elementRef: ElementRef) {
  }

  /**
   * If element is enabled & key pressed, click it
   * @param $event
   */
  @HostListener('keydown.enter', ['$event'])
  @HostListener('keydown.space', ['$event'])
  clickOnElement($event: Event) {
    if (!this.isElementDisabled()) {
      $event.preventDefault();
      this.elementRef.nativeElement.click();
    }
  }

  /**
   * Check if the element is disabled or disabled by it's parent
   * @return disabled status
   */
  isElementDisabled(): boolean {
    return getComputedStyle(this.elementRef.nativeElement, null).pointerEvents === 'none';
  }
}
