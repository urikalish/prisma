import {Component} from "@angular/core";
import {BackgroundService} from "../../services/background/background.service";

// declare let chrome;
declare let window;

@Component({
  selector: 'background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.less']
})
export class BackgroundComponent {
  constructor(private backgroundService: BackgroundService) {
    window.bgService = this.backgroundService;
  }
}
