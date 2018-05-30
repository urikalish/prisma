import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'prism-toggle',
  templateUrl: './prism-toggle.component.html',
  styleUrls: ['./prism-toggle.component.less']
})
export class PrismToggleComponent implements OnInit {
  @Input() state: boolean;
  @Input() toggleStyle: string = "Round";

  constructor() {
  }

  ngOnInit() {
  }
}
