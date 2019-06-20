import {Component, Inject, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {BackgroundService} from "../../services/background/background.service";

@Component({
  selector: 'alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.less']
})
export class AlertComponent implements OnInit {

  @Input() level: string = '';
  @Input() text: string = '';
  @Input() showBackButton: boolean = false;

  constructor(@Inject('bgService') public bgService: BackgroundService,
              private activeRoute: ActivatedRoute) {
  }

  ngOnInit(): void {

    this.level = this.activeRoute.snapshot.params['level'] || this.level;
    this.text = this.activeRoute.snapshot.params['text'] || this.text;
    this.showBackButton = this.activeRoute.snapshot.params['showBackButton'] ? JSON.parse(this.activeRoute.snapshot.params['showBackButton']) : this.showBackButton;
  }
}
