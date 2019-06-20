/**
 * A directive for detecting a click outside of an element.
 *
 */
import {Directive, ElementRef, EventEmitter, HostListener, Output} from "@angular/core";

@Directive({
  selector: '[clickOutside]'
})
export class ClickOutsideDirective {
  private _isInside: boolean;

  @HostListener('click', ['$event'])
  clickInside($event: Event) {
    this._isInside = true;
  }

  @HostListener('document:click', ['$event.target'])
  emitClickOutside(target: Element) {
    if (!this._isInside && !this.elementRef.nativeElement.contains(target)) {
      // console.log('clicked outside!', this.elementRef);
      this.event.emit();
    }

    this._isInside = false;
  }

  @Output('clickOutside') event = new EventEmitter<any>();

  constructor(private elementRef: ElementRef) {
  }

}
