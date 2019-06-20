/**
 * Created by bennun on 28/02/2018.
 */

export interface IConfigurationProvider {
  save(config: PrismConfig): Promise<any>,
  load(): Promise<PrismConfig | null>,
  [propName: string]: any
}

export interface PrismConfig {
  prismURL: string,
  captureEvents: Array<string>,
  features?: Array<string>
}
