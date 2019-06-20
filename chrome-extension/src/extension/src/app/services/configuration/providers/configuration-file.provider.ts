import {PrismConfig} from "../IConfigurationProvider";
import {ConfigurationProvider} from "../provider.abstract";
import {IBrowser} from "../../interfaces/IBrowser";

export class ConfigurationFileProvider extends ConfigurationProvider {

  constructor(browser: IBrowser) {
    super(browser);
    this.browser = browser;
  }

  // Returns null because this provider can't save to file
  public async save(config: PrismConfig): Promise<any> {
    return null;
  }

  public async load(): Promise<PrismConfig> {
    let ret: PrismConfig;

    try {
      ret = await this.browser.getPrismConfigFromFile();
    } catch (e) {
      ret = null;
    }

    return ret;
  }
}
