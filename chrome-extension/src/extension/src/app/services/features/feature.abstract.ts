import {isNullOrUndefined} from "util";

export abstract class Feature {
  protected static readonly UNKNOWN_VERSION = 'UNKNOWN';
  protected readonly _name: string;
  protected readonly onByDefault: boolean;
  protected readonly showInProduction: boolean;
  protected readonly introducedInVersion: string;
  protected _isOn: boolean;
  protected execute: Function;

  constructor(featureName: string,
              onByDefault: boolean,
              introducedInVersion: string = Feature.UNKNOWN_VERSION,
              showInProduction: boolean = false) {

    this._name = featureName;
    this.onByDefault = onByDefault;
    this.introducedInVersion = introducedInVersion;
    this.showInProduction = showInProduction;

    this.isOn = onByDefault;
  }

  get isOn(): boolean {
    return this._isOn;
  }

  set isOn(value: boolean) {
    this._isOn = value;

    if (!isNullOrUndefined(this.execute)) {
      this.execute(value);
    }
  }

  get allowInProduction(): boolean {
    return this.showInProduction;
  }

  get name(): string {
    return this._name;
  }

  set executeOnChange(func: Function) {
    this.execute = func;
  }
}
//
// export interface IFeatureDescriptor {
//   readonly _name: string,
//   readonly onByDefault: boolean,
//   introducedInVersion: string,
//   [propName: string]: any
// }
