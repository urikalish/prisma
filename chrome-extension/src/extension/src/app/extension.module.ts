import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {RouterModule, Routes} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";

import {ExtensionComponent} from "./extension.component";
import {UIComponentsModule} from "ui-components";
import {RecordingComponent} from "./components/recording/recording.component";
import {PopupComponent} from "./components/popup/popup.component";
import {BackgroundComponent} from "./components/background/background.component";
import {GuardService} from "./services/guard/guard.service";
import {BackgroundService} from "./services/background/background.service";
import {ActivationComponent} from "./components/activation/activation.component";
import {ApiService} from "./services/api/api.service";
import {StateService} from "./services/state/state.service";
import {ChromeService} from "./services/chrome/chrome.service";
import {BROWSER_INJECTION, IBrowser} from "./services/interfaces/IBrowser";
import {FeaturesService} from "./services/features/features.service";
import {ConfigurationService} from "./services/configuration/configuration.service";
import {DetectChangesDirective} from "./directives/detect-changes.directive";
import {OptionsComponent} from "./components/options/options.component";
import {WhiteListService} from "./features/white-list/white-list.service";
import {LoaderComponent} from "./components/loader/loader.component";
import {HeaderComponent} from "./components/header/header.component";
import {FeaturesComponent} from './components/features/features.component';
import {AlertComponent} from './components/alert/alert.component';

const appRoutes: Routes = [
  // { path: 'login', component: LoginComponent },
  {path: 'options/:isPopup/:isFirstTime', component: OptionsComponent},
  {path: 'background', component: BackgroundComponent},
  {path: 'popup', component: PopupComponent},
  {path: 'activation', component: ActivationComponent},
  {path: 'alert/:level/:text/:showBackButton', component: AlertComponent},
  {path: '**', component: ExtensionComponent, canActivate: [GuardService]},
  // {path: 'root', component: ExtensionComponent, canActivate: [GuardService]}
];

const bgService = (browser: IBrowser) => {
  // console.log('Service requested!', browser);
  return <BackgroundService>browser.getBackgroundPage();
};

@NgModule({
  declarations: [
    ExtensionComponent,
    PopupComponent,
    RecordingComponent,
    BackgroundComponent,
    ActivationComponent,
    DetectChangesDirective,
    OptionsComponent,
    LoaderComponent,
    HeaderComponent,
    FeaturesComponent,
    AlertComponent
  ],
  imports: [
    BrowserModule,
    UIComponentsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    {provide: BROWSER_INJECTION, useClass: ChromeService},
    {
      provide: 'bgService', useFactory: bgService, deps: [BROWSER_INJECTION]
    },
    BackgroundService,
    GuardService,
    ApiService,
    StateService,
    FeaturesService,
    WhiteListService,
    ConfigurationService
  ],
  bootstrap: [ExtensionComponent]
})
export class ExtensionModule {
}
