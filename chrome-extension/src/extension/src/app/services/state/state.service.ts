import {Injectable} from "@angular/core";
import {isArray, isNullOrUndefined, isObject} from "util";

@Injectable()
export class StateService {
  private readonly STORAGE_KEY = 'prism-state';
  private isSaving: boolean;
  private isReading: boolean;

  public stateStore: StateStore;

  constructor() {
    this.isSaving = false;
    this.isReading = false;
  }

  get key(): string {
    return this.STORAGE_KEY;
  }

  public set(value: any, ...props: Array<string | number>) {
    if (this.isReading) {
      return;
    }

    if (isNullOrUndefined(props) || props.length === 0) {
      this.stateStore = Object.assign({}, value);
      return;
    }

    this.isSaving = true;
    this.stateStore = this.change(this.stateStore, value, ...props);
    this.isSaving = false;

  }

  public get(...props: Array<string | number>): any {
    if (this.isSaving) {
      return;
    }
    this.isReading = true;

    const ret = this.read(this.stateStore, ...props);

    this.isReading = false;

    return ret;
  }

  private change(json: StateStore, value: any, ...props: Array<string | number>): StateStore {
    let newState = Object.assign({}, json);
    let field = newState;

    for (let i = 0; i < props.length; i++) {
      if (i === props.length - 1) {
        field[props[i]] = value;
      } else if (isObject(field[props[i]]) || isArray(field[props[i]])) {
        field = field[props[i]];
      } else {
        throw new Error(`StateService :: can't change property "${props[i]}"`);
      }
    }
    // console.log(newState);
    return newState;
  }

  private read(json: StateStore, ...props: Array<string | number>): any {
    let ret = json;

    for (let prop of props) {
      if (isNullOrUndefined(ret[prop])) {
        ret = null;
        break;
      } else {
        ret = ret[prop];
      }
    }

    return ret;
  }
}

// Imagine we save it to a database, we don't want to save
// "Runtime" data like chrome tab ids etc.
export interface StateStore {
  autURL: string,
  prevStyle: string,
  availableFilters: Array<Filter> | Array<void> | null,
  captureEvents: Array<string> | Array<void> | null,
  colorAutView: boolean,
  colorPallet: Array<string> | Array<void> | null,
  allRecordingTags: Array<string> | Array<void> | null,
  currentRecordingTags: Array<string> | Array<void> | null,
  isRecording: boolean,
  octaneBaseURL: string,
  prismBaseURL: string,
  presets: Array<Preset> | Array<void> | null,
  selectedColorIndex: number,
  selectedPresetIndex: number,
  showTestableEventsOnly: boolean,
  showUniqueEventsOnly: boolean,
}

export interface Preset {
  label: string,
  environments: Array<SelectedEnvironment> | Array<void> | null
}

export interface Environment {
  type: EnvironmentType,
  label: string,
  domains: Array<string> | Array<void> | null
}

export interface SelectedEnvironment extends Environment {
  isSelected: boolean,
  isCovered: boolean,
  selectedFilters: Array<SelectedFilter> | Array<void> | null
}

export interface Filter {
  label: string,
  logicalName: string,
  type: FilterType
}

export interface SelectedFilter extends Filter {
  values: Array<any> | any,
  operator?: string
}

export enum FilterType {
  DATE, STRING, NUMBER
}

export enum DateQueryValues {
  NOW = 'now',
  ONE_DAY = '1d',
  ONE_WEEK = '1w',
  ONE_MONTH = '1M',
  ONE_YEAR = '1y'
}

export const DateFilterValues = [
  {label: 'Past 24 hours', value: `${DateQueryValues.NOW}-${DateQueryValues.ONE_DAY}`},
  {label: 'Past week', value: `${DateQueryValues.NOW}-${DateQueryValues.ONE_WEEK}`},
  {label: 'Past month', value: `${DateQueryValues.NOW}-${DateQueryValues.ONE_MONTH}`},
  {label: 'Past year', value: `${DateQueryValues.NOW}-${DateQueryValues.ONE_YEAR}`}
];

export enum EnvironmentType {
  MANUAL, AUTOMATION, PRODUCTION
}
