import {
  AfterContentChecked,
  AfterContentInit,
  ContentChild,
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  Renderer2
} from "@angular/core";

@Directive({
  selector: '[prismToggle]',
})
export class PrismToggleDirective implements AfterContentInit, AfterContentChecked {
  HIDDEN_CLASS = 'hidden';
  isEventsRegistered: boolean = false;

  @ContentChildren("toggleButton") toggleButtons: QueryList<ElementRef>;  // toggle content on/off
  @ContentChildren("toggleOffButton") toggleOffButtons: QueryList<ElementRef>;  // toggle content off
  @ContentChildren("showWhenOpened") showWhenOpened: QueryList<ElementRef>;      // show element when on
  @ContentChildren("showWhenClosed") showWhenClosed: QueryList<ElementRef>;      // show element when off
  @ContentChild("toggleContent") toggleContentRef: ElementRef;        // element to toggle

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

      this.toggleButtons.forEach((elem: ElementRef) => {
        this.renderer.listen(elem.nativeElement, 'click', this.toggle.bind(this));
      });

      this.toggleOffButtons.forEach((elem: ElementRef) => {
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


  toggle(event?: Event) {
    this.toggleTo(!this.isToggled);
  }

  toggleTo(state: boolean) {
    this.isToggled = state;
    this.isToggledChange.emit(this.isToggled);
  }

  toggleElements(hideShownWhenOpened: boolean) {
    if (hideShownWhenOpened) {
      this.showWhenOpened.forEach((elem: ElementRef) => {
        this.renderer.addClass(elem.nativeElement, this.HIDDEN_CLASS);
      });

      this.showWhenClosed.forEach((elem: ElementRef) => {
        this.renderer.removeClass(elem.nativeElement, this.HIDDEN_CLASS);
      });
    } else {
      this.showWhenOpened.forEach((elem: ElementRef) => {
        this.renderer.removeClass(elem.nativeElement, this.HIDDEN_CLASS);
      });

      this.showWhenClosed.forEach((elem: ElementRef) => {
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

  // // Close toggle when ESC is pressed
  // respondToKey($event) {
  //   if (isNumber(this.toggleOffKeyCode) && $event.keyCode === this.toggleOffKeyCode && this.isToggled) { //ESC
  //     $event.stopPropagation();
  //     console.log('prismToggle closed by key');
  //     this.toggle();
  //   }
  // }
}
