import { BrowserModule } from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from "@angular/forms";

import { PopupComponent } from './popup.component';
import {UIComponentsModule} from "ui-components";
import { RecordingComponent } from './components/recording/recording.component';
import {MessagingService} from "./services/messaging/messaging.service";
import {RecordingStateService} from "./services/recording-state/recording-state.service";

@NgModule({
  declarations: [
    PopupComponent,
    RecordingComponent,
  ],
  imports: [
    BrowserModule,
    UIComponentsModule,
    FormsModule
  ],
  providers: [MessagingService, RecordingStateService],
  bootstrap: [PopupComponent]
})
export class PopupModule { }
