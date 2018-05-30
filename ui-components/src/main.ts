import {enableProdMode} from "@angular/core";
import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";
import {environment} from "./environments/environment";
import {DocsModule} from "./app/docs/docs.module";

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(DocsModule);
