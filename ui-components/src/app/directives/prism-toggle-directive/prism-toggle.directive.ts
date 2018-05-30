import {
  AfterContentChecked,
  AfterContentInit,
  ContentChild,
  ContentChildren,
  Directive,
  EventEmitter,
  Input,
  Output,
  Renderer2
} from "@angular/core";
import {isNumber} from "util";

@Directive({
  selector: '[prismToggle]',
})
export class PrismToggleDirective implements AfterContentInit, AfterContentChecked {
  HIDDEN_CLASS = 'hidden';
  isEventsRegistered = false;

  @ContentChildren("toggleButton") toggleButtons;  // toggle content on/off
  @ContentChildren("toggleOffButton") toggleOffButtons;  // toggle content off
  @ContentChildren("showWhenOpened") showWhenOpened;      // show element when on
  @ContentChildren("showWhenClosed") showWhenClosed;      // show element when off
  @ContentChild("toggleContent") toggleContentRef;        // element to toggle

  @Input() isToggled: boolean = false;
  @Input() toggleOffKeyCode: number;
  @Input() classWhenToggled: string = this.HIDDEN_CLASS;

  @Output() isToggledChange = new EventEmitter<boolean>();

  constructor(private renderer: Renderer2) {
  }

  // Called only once
  ngAfterContentInit() {
    if (!this.isEventsRegistered) {
      this.isEventsRegistered = true;

      this.toggleButtons.forEach((elem) => {
        this.renderer.listen(elem.nativeElement, 'click', this.toggle.bind(this));
      });

      this.toggleOffButtons.forEach((elem) => {
        this.renderer.listen(elem.nativeElement, 'click', () => {
          this.toggleTo(false)
        });
      });
    }
  }

  // Called after every change
  ngAfterContentChecked() {
    this.toggleContent();
  }


  toggle(event?) {
    this.toggleTo(!this.isToggled);
  }

  toggleTo(state: boolean) {
    this.isToggled = state;
    this.isToggledChange.emit(this.isToggled);
  }

  toggleElements(hideShownWhenOpened) {
    if (hideShownWhenOpened) {
      this.showWhenOpened.forEach((elem) => {
        this.renderer.addClass(elem.nativeElement, this.HIDDEN_CLASS);
      });

      this.showWhenClosed.forEach((elem) => {
        this.renderer.removeClass(elem.nativeElement, this.HIDDEN_CLASS);
      });
    } else {
      this.showWhenOpened.forEach((elem) => {
        this.renderer.removeClass(elem.nativeElement, this.HIDDEN_CLASS);
      });

      this.showWhenClosed.forEach((elem) => {
        this.renderer.addClass(elem.nativeElement, this.HIDDEN_CLASS);
      });
    }
  };

  toggleContent() {
    if (this.isToggled) {
      // Should hide content or toggle class on content element?
      if (this.HIDDEN_CLASS === this.classWhenToggled) {
        this.renderer.removeClass(this.toggleContentRef.nativeElement, this.HIDDEN_CLASS);
        this.renderer.setAttribute(this.toggleContentRef.nativeElement, 'aria-hidden', 'false');
        this.renderer.setAttribute(this.toggleContentRef.nativeElement, 'data-disabled', 'false');
        this.toggleElements(false);
      } else {
        this.renderer.addClass(this.toggleContentRef.nativeElement, this.classWhenToggled);
        this.toggleElements(true);
      }

    } else {
      // Should hide content or toggle class on content element?
      if (this.HIDDEN_CLASS === this.classWhenToggled) {
        this.renderer.addClass(this.toggleContentRef.nativeElement, this.HIDDEN_CLASS);
        this.renderer.setAttribute(this.toggleContentRef.nativeElement, 'aria-hidden', 'true');
        this.renderer.setAttribute(this.toggleContentRef.nativeElement, 'data-disabled', 'true');
        this.toggleElements(true);
      } else {
        this.renderer.removeClass(this.toggleContentRef.nativeElement, this.classWhenToggled);
        this.toggleElements(false);
      }
    }
  }

  // Close toggle when ESC is pressed
  respondToKey($event) {
    if (isNumber(this.toggleOffKeyCode) && $event.keyCode === this.toggleOffKeyCode && this.isToggled) { //ESC
      $event.stopPropagation();
      console.log('prismToggle closed by key');
      this.toggle();
    }
  }
}
