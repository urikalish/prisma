import {enableProdMode} from "@angular/core";
import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";

import {ExtensionModule} from "./app/extension.module";
import {environment} from "./environments/environment";

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(ExtensionModule)
  .catch(err => console.log(err));
