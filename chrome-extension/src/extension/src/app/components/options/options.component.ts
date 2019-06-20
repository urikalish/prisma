import {Component, Inject, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {BackgroundService} from "../../services/background/background.service";
import {StateService} from "../../services/state/state.service";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.less']
})
export class OptionsComponent implements OnInit {

  private readonly VALID_REGEX_URL = /https:\/\/\S+/;
  private readonly URL_NOT_REACHABLE: string = "Unable to connect to the PRiSMA server";
  private readonly URL_NOT_VALID: string = `Invalid server URL <br> Use the following format <strong>https://[host]:[port]</strong>`;

  private aliveSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public alive$ = this.aliveSubject.asObservable();

  public isProduction: boolean;
  public errorMessage: string = "";

  backgroundService: BackgroundService;
  isPopup: boolean;
  isFirstTime: boolean;
  loading: boolean = false;

  get isServerAlive(): boolean {
    return this.aliveSubject.getValue();
  }

  constructor(@Inject('bgService') bgService: BackgroundService,
              private router: Router,
              private activeRoute: ActivatedRoute) {
    this.backgroundService = bgService;
    this.isProduction = environment.production;
  }

  get state(): StateService {
    return this.backgroundService.state;
  }

  ngOnInit() {
    this.isPopup = JSON.parse(this.activeRoute.snapshot.params['isPopup']);
    this.isFirstTime = JSON.parse(this.activeRoute.snapshot.params['isFirstTime']);

    if (!this.isFirstTime) {
      this.checkConnectivity();
    }
  }

  clearErrorMessage(value) {
    if (!value) {
      this.errorMessage = '';
    }
  }

  async save(serverURL: string) {

    if (!this.VALID_REGEX_URL.test(serverURL)) {
      this.errorMessage = this.URL_NOT_VALID;
      return;
    }

    const alive = await this.checkConnectivity(serverURL);
    if (alive) {
      this.errorMessage = "";
      this.backgroundService.prismServerURL = serverURL;
      await this.backgroundService.saveCurrentConfiguration();
      // opening options page directly is only for settings, do not navigate to activation page
      if (this.isPopup) {
        await this.router.navigate(['/'], {queryParams: {page: 'popup'}});
      } else {
        return window.close();
      }
    }
    else {
      this.errorMessage = this.URL_NOT_REACHABLE;
    }
  }

  async cancel() {
    // opening options page directly is only for settings, do not navigate to popup page
    if (this.isPopup && this.isServerAlive) {
      await this.router.navigate(['/'], {queryParams: {page: 'popup'}});
    } else {
      return window.close();
    }
  }

  async clear() {
    this.backgroundService.prismServerURL = null;
    this.backgroundService.clearState();
    await this.backgroundService.browser.clearStorage();
    return window.close();
  }

  async checkConnectivity(url?: string) {
    this.loading = true;
    const alive = await this.backgroundService.isPrismServerReachable(url);
    this.loading = false;
    this.aliveSubject.next(alive);
    return alive;
  }
}
