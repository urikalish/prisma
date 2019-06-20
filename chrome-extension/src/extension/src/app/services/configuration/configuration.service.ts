import {Inject, Injectable} from "@angular/core";
import {PrismConfig} from "./IConfigurationProvider";
import {isNullOrUndefined} from "util";
import {ConfigurationProvider} from "./provider.abstract";
import {BROWSER_INJECTION, IBrowser} from "../interfaces/IBrowser";
import {ConfigurationFileProvider} from "./providers/configuration-file.provider";
import {StorageProvider} from "./providers/storage.provider";

const DECLARE_PROVIDERS = [
  ConfigurationFileProvider,
  StorageProvider
];

@Injectable()
export class ConfigurationService extends ConfigurationProvider {
  private providers: Array<ConfigurationProvider>;

  constructor(@Inject(BROWSER_INJECTION) browser: IBrowser) {
    super(browser);
    this.providers = [];
    this.init();
  }

  private init() {
    DECLARE_PROVIDERS.forEach(provider => {
      const instance = new provider(this.browser);
      this.providers.push(instance);
    });
  }

  public async save(config: PrismConfig) {
    let ret;

    for (let provider of this.providers) {
      try {
        ret = await provider.save(config);

        if (!isNullOrUndefined(ret)) {
          // console.log('SAVED', config, ret);
          break;
        }
      } catch (e) {
        throw e;
      }
    }

    return ret;
  }

  public async load(): Promise<PrismConfig> {
    let ret: PrismConfig;

    for (let provider of this.providers) {
      try {
        ret = await provider.load();

        if (!isNullOrUndefined(ret)) {
          break;
        }
      } catch (e) {
        ret = null;
      }
    }

    return ret;
  }
}

