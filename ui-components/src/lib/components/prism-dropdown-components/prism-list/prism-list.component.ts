import {Component, ElementRef, ViewChild} from "@angular/core";

@Component({
  selector: 'prism-list',
  templateUrl: './prism-list.component.html',
  styleUrls: ['./prism-list.component.less']
})
export class PrismListComponent {
  @ViewChild('list') listRef: ElementRef;

  constructor() {
  }
}
