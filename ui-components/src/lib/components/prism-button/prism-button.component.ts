import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'prism-button',
  templateUrl: './prism-button.component.html',
  styleUrls: ['./prism-button.component.less']
})
export class PrismButtonComponent implements OnInit {
  @Input() text: string;
  @Input() image: string;
  @Input() size: string = "small";
  @Input() border: boolean = true;

  constructor() {
  }

  ngOnInit() {
  }
}
