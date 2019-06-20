import {PrismConfig} from "../IConfigurationProvider";
import {ConfigurationProvider} from "../provider.abstract";
import {IBrowser} from "../../interfaces/IBrowser";

export class StorageProvider extends ConfigurationProvider {
  readonly STORAGE_KEY = 'prism-config';

  constructor(browser: IBrowser) {
    super(browser);
  }

  public async save(config: PrismConfig): Promise<any> {
    let ret;
    try {
      ret = await this.browser.saveToStorage(this.STORAGE_KEY, config);
    } catch (e) {
      ret = null;
      throw new Error(`StorageService:: Failed to save configurations! ${e}`);
    }

    return ret;
  }

  public async load(): Promise<PrismConfig> {
    let ret: PrismConfig;

    try {
      ret = await this.browser.getFromStorage(this.STORAGE_KEY);
    } catch (e) {
      console.error(e);
      ret = null;
    }

    return ret;
  }

}
