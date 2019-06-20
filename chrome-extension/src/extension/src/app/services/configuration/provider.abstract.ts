import {IConfigurationProvider, PrismConfig} from "./IConfigurationProvider";
import {IBrowser} from "../interfaces/IBrowser";

/**
 * Abstract class for configuration provider
 * Implement in-order to add another configuration provider
 */

export abstract class ConfigurationProvider implements IConfigurationProvider {
  protected browser: IBrowser;

  constructor(browser: IBrowser) {
    this.browser = browser;
  }

  /**
   * save new configuration
   * @param {PrismConfig} config - new config to save
   * @return {Promise<any>} - return null if not saved
   */
  abstract save(config: PrismConfig): Promise<any>;

  /**
   * load the configuration
   * @return {Promise<PrismConfig | null>} - return null if config
   * wasn't found
   */
  abstract load(): Promise<PrismConfig | null>;
}
