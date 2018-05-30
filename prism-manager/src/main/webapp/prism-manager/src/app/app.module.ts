import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from "@angular/forms";

import { AppComponent } from './app.component';
import { HttpClientModule } from "@angular/common/http";
import { ApplicationListComponent } from './components/application-list/application-list.component';
import { UIComponentsModule } from "ui-components";
import { ProductsModelService } from "./products-model.service";

@NgModule({
  declarations: [
    AppComponent,
    ApplicationListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    UIComponentsModule,
    FormsModule
  ],
  providers: [ProductsModelService],
  bootstrap: [AppComponent]
})
export class AppModule { }
