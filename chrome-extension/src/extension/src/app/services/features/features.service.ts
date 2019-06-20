import {Injectable} from "@angular/core";
import {Feature} from "./feature.abstract";
import {WhiteListFeature} from "./declarations/whiteList.feature";
import {SelectorsOpacityFeature} from "./declarations/selectorsOpacity.feature";
import {isNullOrUndefined} from "util";
import {SingleDomainAUTFeature} from "./declarations/singleDomainAUT.feature";
import {ShowOnlyMeaningfulEvents} from "./declarations/showOnlyMeaningfulEvents.feature";
import {ShowSimilarElements} from "./declarations/showSimilarElements";

const DECLARE_FEATURES = [
  WhiteListFeature,
  SelectorsOpacityFeature,
  SingleDomainAUTFeature,
  ShowOnlyMeaningfulEvents,
  ShowSimilarElements
];

@Injectable()
export class FeaturesService {
  private features: Map<string, Feature>;

  public get featuresList(): Array<Feature> {
    return [...this.features.values()];
  }

  constructor() {
    this.features = new Map<string, Feature>();
    this.init();
  }

  init() {
    DECLARE_FEATURES.forEach(feature => {
      const instance = new feature();

      console.log(`FeaturesService:: ${instance.name} loaded`);

      this.features.set(instance.name, instance);
    });
  }

  isFeatureOn(name: string): boolean {
    try {
      return this.features.get(name).isOn;
    } catch (e) {
      throw new Error(`FeaturesService:: feature ${name} not found!`);
    }
  }

  toggleFeature(name: string, state?: boolean) {
    try {
      if (isNullOrUndefined(state)) {
        state = !this.features.get(name).isOn;
      }

      this.features.get(name).isOn = state;
    } catch (e) {
      throw new Error(`FeaturesService:: feature ${name} not found!`);
    }
  }

  executeOnFeatureChange(name: string, func: Function) {
    try {
      this.features.get(name).executeOnChange = func;
    } catch (e) {
      throw new Error(`FeaturesService:: feature ${name} not found!`);
    }
  }
}

