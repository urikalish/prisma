import {Component, ElementRef, Input, ViewChild} from "@angular/core";

@Component({
  selector: 'prism-list-item',
  templateUrl: './prism-list-item.component.html',
  styleUrls: ['./prism-list-item.component.less']
})

export class PrismListItemComponent {

  @Input() label: string = '';
  @ViewChild('item') itemRef: ElementRef;
  @ViewChild('itemContent') itemContentRef: ElementRef;
  // @HostBinding('tabindex') tabindex = -1;

  constructor() {
  }
}
