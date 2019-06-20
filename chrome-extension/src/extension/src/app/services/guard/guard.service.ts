import {Inject, Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {BackgroundService} from "../background/background.service";
import {StateService} from "../state/state.service";
import {isNullOrUndefined} from "util";
import {WhiteListService} from "../../features/white-list/white-list.service";
import {FeaturesService} from "../features/features.service";
import {IBrowser} from "../interfaces/IBrowser";

const BLACKLIST = [
  'chrome://*', 'https://chrome.google.*'
];

@Injectable()
export class GuardService implements CanActivate {

  // backgroundService: BackgroundService;

  constructor(private router: Router,
              private whitelist: WhiteListService,
              @Inject('bgService') private backgroundService: BackgroundService) {
    // this.backgroundService = backgroundService;
    this.whitelist.blackList = BLACKLIST;
  }

  get state(): StateService {
    return this.backgroundService.state;
  }

  get features(): FeaturesService {
    return this.backgroundService.features;
  }

  get browser(): IBrowser {
    return this.backgroundService.browser;
  }

  private isActiveTabAllowed(url: string): boolean {
    if (isNullOrUndefined(url)) {
      return false;
    } else if (this.features.isFeatureOn('white-list')) {
      return this.whitelist.isAllowed(url);
    }

    return true;
  }

  private notAllowedURLText(url: string) {
    return `You cannot use PRiSMA to record on <strong>${url}</strong>,
                      Select a different application.`;
  }

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Promise<boolean> | boolean {
    const page = route.queryParams['page'];

    if (isNullOrUndefined(page) || isNullOrUndefined(this.backgroundService)) {
      this.router.navigate(['/' + page]);
      return true;
    } else {

      // Keep only 1 popup window open at any time
      let views = this.backgroundService.browser.getViews();

      for (let view of views) {
        if (view !== window) {
          view.close();
        }
      }
    }

    return this.asyncHandler(page);
  }

  async asyncHandler(page: string): Promise<boolean> {
    let path;
    const isFirstTimeConfiguration = !this.backgroundService.isExtensionConfigured;

    if (!isFirstTimeConfiguration && page !== 'extension-options') {
      const alive = await this.backgroundService.isPrismServerReachable();

      if (!alive) {
        page = 'options';
      }
    }

    switch (page) {
      case 'extension-options':
        path = ['/options', false, isFirstTimeConfiguration];
        break;

      case 'options':
        path = ['/options', true, isFirstTimeConfiguration];

        break;

      // Happens only when the extension icon is clicked!
      case 'popup':
        if (isFirstTimeConfiguration) {
          // Show options for 1st time
          path = ['/options', true, isFirstTimeConfiguration];
        } else {
          let activeURL: URL;
          const level = "WARNING";
          let url: string;

          try {
            activeURL = new URL(await this.browser.getActiveTabURL());
            const canActivate = this.isActiveTabAllowed(activeURL.origin);

            if (canActivate) {
              const shouldActivate = !(await this.backgroundService.shouldMonitor());
              // Show injection / prism UI
              path = shouldActivate ? ['/activation'] : ['/popup'];
            } else {
              url = activeURL.origin;
              path = ['/alert', level, this.notAllowedURLText(url), false];
            }
          } catch (e) {
            // console.log('NOT ALLOWED ERROR!', e);
            url = 'This AUT';
            path = ['/alert', level, this.notAllowedURLText(url), false];
          }
        }

        break;

      default:
        path = [`/${page}`];
    }

    this.router.navigate(path);
    return true;
  }


}
