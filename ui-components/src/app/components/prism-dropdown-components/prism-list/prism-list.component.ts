import {Component, ViewChild} from "@angular/core";

@Component({
  selector: 'prism-list',
  templateUrl: './prism-list.component.html',
  styleUrls: ['./prism-list.component.less']
})
export class PrismListComponent {

  // private mouseSelection: boolean = false;
  //
  // @Input() focusedIndex: number = 0;
  //
  // @Output() @ContentChildren(PrismListItemComponent, {read: ViewContainerRef}) listItems;
  //
  @ViewChild('list') listRef;

  constructor() {
  }

  // respondToMouse(state: boolean) {
  //   this.mouseSelection = state;
  //   this.focusedIndex = -1;
  //
  //   this.listElement.nativeElement.focus();
  // }
  //
  // respondToKey($event): void {
  //   // if mouse over list, ignore keyboard
  //   if (this.mouseSelection) {
  //     $event.preventDefault();
  //     return;
  //   }
  //
  //   switch ($event.key.toLowerCase()) {
  //     case 'tab': // tab
  //       $event.preventDefault();
  //       $event.stopPropagation();
  //
  //       if ($event.shiftKey) { //up
  //         this.focusListItemIndex(--this.focusedIndex);
  //
  //       } else { //down
  //         this.focusListItemIndex(++this.focusedIndex);
  //       }
  //       break;
  //     case 'arrowdown': // DOWN
  //       $event.preventDefault();
  //       $event.stopPropagation();
  //
  //       this.focusListItemIndex(++this.focusedIndex);
  //       break;
  //
  //     case 'arrowup': // UP
  //       $event.preventDefault();
  //       $event.stopPropagation();
  //
  //       this.focusListItemIndex(--this.focusedIndex);
  //       break;
  //   }
  // }
  //
  // focusListItemIndex(index: number): void {
  //   if (index >= this.listItems.length) {
  //     this.focusedIndex = index = 0;
  //   } else if (index < 0) {
  //     this.focusedIndex = index = this.listItems.length - 1;
  //   }
  //
  //   this.listItems.toArray()[index].element.nativeElement.querySelector('li').focus();
  // }
}
