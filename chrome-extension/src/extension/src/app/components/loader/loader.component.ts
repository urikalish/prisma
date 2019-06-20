import {Component, Input, OnInit} from "@angular/core";

@Component({
  selector: 'loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.less']
})
export class LoaderComponent implements OnInit {
  @Input('loader-show') show: boolean = true;
  @Input() text: string = 'loading...';

  constructor() {
  }

  ngOnInit() {
  }

}
