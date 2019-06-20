import {Component, Inject, OnInit} from "@angular/core";
import {BackgroundService} from "../../services/background/background.service";
import {FeaturesService} from "../../services/features/features.service";

@Component({
  selector: 'prism-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.less']
})
export class FeaturesComponent implements OnInit {

  constructor(@Inject('bgService') public backgroundService: BackgroundService) {
  }

  public get features(): FeaturesService {
    return this.backgroundService.features;
  }

  ngOnInit() {
  }

}
