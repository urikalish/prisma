import {Component, Inject, Input} from "@angular/core";
import {BackgroundService} from "../../services/background/background.service";
import {Router} from "@angular/router";
import {StateService} from "../../services/state/state.service";

@Component({
  selector: 'popup-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent {

  @Input() title: string = '';
  @Input() showBrand: boolean = true;
  @Input() showButtons: boolean = true;
  @Input() showBackButton: boolean = false;

  constructor(@Inject('bgService') public backgroundService: BackgroundService,
              private router: Router) {
  }

  public get state(): StateService {
    return this.backgroundService.state;
  }

  optionsPage() {
    this.router.navigate(['/options', true, false]);
  }

  convertToRGB(color: string) {
    return `rgb(${color})`;
  }
}
