import {Component, Inject} from "@angular/core";
import {BackgroundService} from "../../services/background/background.service";
import {Router} from "@angular/router";

@Component({
  selector: 'activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.less']
})
export class ActivationComponent {

  backgroundService: BackgroundService;
  readonly state;
  activeURL: string;

  constructor(private router: Router,
              @Inject('bgService') backgroundService: BackgroundService) {
    this.backgroundService = backgroundService;
    this.state = this.backgroundService.state;
    this.activeURL = new URL(this.backgroundService.getActiveTabURL()).origin;
  }

  async injectAgent() {
    this.backgroundService.declareNewAut();
    this.router.navigate(['/popup']);
  }
}
