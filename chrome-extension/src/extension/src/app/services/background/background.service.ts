import {Inject, Injectable, SecurityContext} from "@angular/core";
import {ApiService, GetEventsResponse} from "../api/api.service";
import {
  DateFilterValues,
  Environment as IEnvironment,
  EnvironmentType,
  Filter,
  FilterType,
  SelectedFilter,
  StateService,
  StateStore
} from "../state/state.service";
import {ScriptExecutionTime} from "../chrome/chrome.service";
import {isNullOrUndefined, isString} from "util";
import {BROWSER_INJECTION, IBrowser} from "../interfaces/IBrowser";
import {ConfigurationService} from "../configuration/configuration.service";
import {FeaturesService} from "../features/features.service";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";
import {DomSanitizer} from "@angular/platform-browser";
import {PrismConfig} from "../configuration/IConfigurationProvider";

@Injectable()
export class BackgroundService {

  // the action observable is used to keep track on inner changes in this
  // service. when a UI needs to be updated with data from the background
  // it should subscribe to it & call detectChanges()
  private readonly newActionSubject: BehaviorSubject<boolean>;
  private readonly newAction$: Observable<boolean>;

  private readonly hasRunsSubject: BehaviorSubject<boolean>;
  private readonly hasRuns$: Observable<boolean>;

  get action$(): Observable<boolean> {
    return this.newAction$;
  }

  public markNewAction() {
    this.newActionSubject.next(true);
  }

  get runs$() {
    return this.hasRuns$;
  }

  public markHasRuns(hasRuns: boolean) {
    this.hasRunsSubject.next(hasRuns);
  }

  private readonly scriptInjectionDefaults = {
    allFrames: true,
    frameId: 0,
    runAt: ScriptExecutionTime.START
  };

  // The browser the extension runs in
  public readonly browser: IBrowser;

  private readonly prismRecordingIconPath = '../../../assets/prism_logo_rec_16.png';
  private readonly prismMonitoringIconPath = '../../../assets/prism_logo_16.png';
  private readonly prismNotMonitoringIconPath = '../../../assets/no-agent.png';
  private readonly prismErrorIconPath = '../../../assets/prism-error.png';
  private currentlyExecuting: boolean = false;
  private _prismaConnectionError: boolean = false;
  private lastAutTabID: number;
  private _selectors: GetEventsResponse;
  private _prevStyle: string = null;
  private _selectedFilter: Filter;
  private _selectedFilterValues: Array<string | void> = [];
  //private _currentSessionId: string = null;

  constructor(@Inject(BROWSER_INJECTION) browser: IBrowser,
              private api: ApiService,
              public readonly configProvider: ConfigurationService,
              public readonly features: FeaturesService,
              public readonly state: StateService,
              private sanitizer: DomSanitizer) {

    this.newActionSubject = new BehaviorSubject<boolean>(false);
    this.newAction$ = this.newActionSubject.asObservable();

    this.hasRunsSubject = new BehaviorSubject<boolean>(true);
    this.hasRuns$ = this.hasRunsSubject.asObservable();

    this.browser = browser;

    this.configProvider.load().then(config => {
      if (!isNullOrUndefined(config)) {
        this.prismServerURL = config.prismURL;
        this.state.set(config.captureEvents, 'captureEvents');
      }
    });

    this.clearState();

    this.browser.getFromStorage(this.state.key)
      .then( (state) => {
        if (!isNullOrUndefined(state)) {
          this.state.stateStore = state;
        }
      });

    //init event listeners
    this.browser.onTabUpdated(this.monitoringExecution.bind(this));
    this.browser.onTabActivated(this.monitoringExecution.bind(this));
    this.browser.onTabAttached(this.monitoringExecution.bind(this));
    this.browser.onTabDetached(this.monitoringExecution.bind(this));
    this.browser.onTabMoved(this.monitoringExecution.bind(this));
    this.browser.onTabRemoved(this.onTabRemoved.bind(this));
    this.browser.onWindowChanged(this.monitoringExecution.bind(this));

    this.browser.onMessage(this.onMessage.bind(this));

    // Keep a connection to injected content scripts,
    // When disconnected, the content script will reload the page
    this.browser.onConnect((req) => {
      if (req.name === 'prism-content-script') {
        req.postMessage(true);
      }
    });

    // TODO: Handle features toggling
    this.features.executeOnFeatureChange('selectors-opacity', (value) => {
      this.filterEvents().then();
    });

    this.features.executeOnFeatureChange('show-only-meaningful-events', (value) => {
      this.filterEvents().then();
    });

    this.features.executeOnFeatureChange('single-domain-aut', (value) => {
      this.filterEvents().then();
    });

    this.features.executeOnFeatureChange('show-similar-elements', (value) => {
      this.toggleUniqueEvents();
      this.filterEvents().then();
    });
  }

  clearState() {

    let baseStore: StateStore = {
      autURL: '',
      prevStyle: '',
      availableFilters: [],
      captureEvents: ['click', 'change'],
      colorAutView: true,
      colorPallet: [],
      allRecordingTags: null,
      currentRecordingTags: [],
      isRecording: false,
      octaneBaseURL: '',
      prismBaseURL: '',
      presets: [],
      selectedColorIndex: 0,
      selectedPresetIndex: 0,
      showTestableEventsOnly: false,
      showUniqueEventsOnly: true,
    };

    let environments: Array<IEnvironment> = [
      {
        type: EnvironmentType.MANUAL,
        label: 'Manual Tests',
        domains: null
      },
      {
        type: EnvironmentType.AUTOMATION,
        label: 'Automated Tests',
        domains: null
      }
    ];

    let presets = [
      {label: 'Manual test coverage', init: [[true, true], [false, false]]},
      {label: 'Overall test coverage', init: [[true, true], [true, true]]},
      {label: 'Automated test coverage', init: [[false, false], [true, true]]},
      {label: 'Covered in manual testing, not covered in automation', init: [[true, true], [true, false]]}
    ].map(preset => {
      return {
        label: preset.label,
        environments: environments.map((env, index) => {
          return Object.assign({}, env, {
            isSelected: preset.init[index][0],
            isCovered: preset.init[index][1],
            selectedFilters: []
          });
        })
      }
    });

    let filters = [
      {label: 'Date', type: FilterType.DATE, logicalName: 'date'},
      {label: 'Recording', type: FilterType.STRING, logicalName: 'recording-name'}
    ];

    let colors = [
      '202, 170, 209',
      '62, 204, 253',
      '115, 221, 84',
      '252, 179, 84',
      '252, 207, 39'
    ];


    // init state
    this.state.set(baseStore);

    this.state.set(colors, 'colorPallet');

    this.state.set(filters, 'availableFilters');

    this.state.set(presets, 'presets');

  }

  set prismServerURL(url: string) {
    if (isNullOrUndefined(url)) {
      this.api.baseURL = '';
      this.state.set('', 'prismBaseURL');
    } else {
      url = this.sanitizer.sanitize(SecurityContext.URL, url);

      if (isNullOrUndefined(url)) {
        throw new Error('BackgroundService:: invalid URL');
      }

      const urlObject = new URL(url);

      this.api.baseURL = urlObject.origin;
      this.state.set(urlObject.origin, 'prismBaseURL');
    }

    this.sendConfigurationToAllAUTTabs()
      .then();
  }

  set selectedFilterValues(value: Array<string | void>) {
    this._selectedFilterValues = value;
  }

  set prismaConnectionError(value: boolean) {
    this._prismaConnectionError = value;
  }

  get prismaConnectionError(): boolean {
    return this._prismaConnectionError;
  }

  get selectedFilterValues(): Array<string | void> {
    return this._selectedFilterValues;
  }

  get selectors(): GetEventsResponse {
    return this._selectors;
  }

  get prevStyle(): string {
    return this._prevStyle;
  }

  get selectedFilter(): Filter {
    return this._selectedFilter;
  }

  set selectors(value: GetEventsResponse) {
    this._selectors = value;
  }

  set prevStyle(value: string) {
    this._prevStyle = value;
    this.state.set(value, 'prevStyle');
  }

  set selectedFilter(filter: Filter) {
    this.selectedFilterValues = null;
    this._selectedFilter = filter;

    this.getFilterValues(filter).then((values) => {
      this.selectedFilterValues = values;
      this.markNewAction();
    });
  }

  saveCurrentConfiguration(): Promise<boolean> {
    const config: PrismConfig = {
      prismURL: this.state.get('prismBaseURL'),
      captureEvents: this.state.get('captureEvents')
    };

    return this.configProvider.save(config);
  }

  /*
   Coverage on/off
   */
  toggleCoverage() {
    const field = 'colorAutView';
    let state = !this.state.get(field);
    this.state.set(state, field);

    // const config = {
    //   visible: this.state.get('colorAutView'),
    // };

    this.sendConfigurationToAllAUTTabs().then(() => {
      // console.log('Toggled in AUT');
      this.markNewAction();
      // return this.sendCurrentURLToAgent();
    });
  }

  // Environment covered / not-covered
  toggleEnvCovered(environmentIndex: number) {
    if (isNaN(environmentIndex)) {
      return;
    }
    const presetIndex = this.state.get('selectedPresetIndex');
    const state = this.state.get('presets', presetIndex, 'environments', environmentIndex, 'isCovered');

    // if (state !== value) {
    this.state.set(!state, 'presets', presetIndex, 'environments', environmentIndex, 'isCovered');

    let color = this.state.get('colorPallet', this.state.get('selectedColorIndex'));
    this.prevStyle = this.createHighlighterStyleWithOpacity(this.selectors, 5, color);

    console.log(this.prevStyle);

    this.sendConfigurationToAllAUTTabs().then(() => {
      this.markNewAction();
    });
    // }
  }

  toggleUniqueEvents() {
    const state = this.features.isFeatureOn('show-similar-elements');
    this.state.set(!state, 'showUniqueEventsOnly');
  }

  isPrismServerReachable(url?): Promise<boolean> {
    let toggleIcon: boolean;

    if (isNullOrUndefined(url)) {
      url = this.state.get('prismBaseURL');
      toggleIcon = true;
    } else {
      const urlObject = new URL(url);
      url = urlObject.origin;
      toggleIcon = false;
    }

    return new Promise((res, rej) => {
      this.api.checkConnectivity(url)
        .subscribe(
          data => {
            this.prismaConnectionError = false;
            return res(true)
          },
          err => {
            if (toggleIcon) {
              this.setIconForAllAUTTabs(this.prismErrorIconPath);
              this.prismaConnectionError = true;
            }
            return res(false);
          }
        )
    });
  }

  /*
   Change highlighted color
   */
  changeHighlighterColor(colorIndex) {
    const field = 'selectedColorIndex';
    this.state.set(colorIndex, field);

    let color = this.state.get('colorPallet', colorIndex);
    this.prevStyle = this.createHighlighterStyleWithOpacity(this.selectors, 5, color);

    this.sendConfigurationToAllAUTTabs().then(() => {
      // console.log('selected new color!', color);
      this.markNewAction();
      // return this.sendCurrentURLToAgent();
    });
  }

  /*
   Recording
   */
  setCurrentRecordingTags(...recordingNames) {
    let field = 'currentRecordingTags';

    if (recordingNames.length === 0 || isNullOrUndefined(recordingNames[0])) {
      recordingNames = [];
    }

    this.state.set(recordingNames, field);
    this.markNewAction();
  }

  startRecording() {
    this.state.set(true, 'isRecording');
    this.addNewRecordingTags();
    //this._currentSessionId = uuid(); //Generate a UUID for the recording session

    const tags = this.state.get('currentRecordingTags');

    this.sendConfigurationToAllAUTTabs()
      .then(() =>
        this.sendCurrentURLToAgent())
      .then(() => {
        this.setIconForAllAUTTabs(this.prismRecordingIconPath);
        this.setTitleForAllAUTTabs(`PRiSMA Recording(${tags[0]})`);
        this.markNewAction();
      });
  }

  stopRecording() {
    this.state.set(false, 'isRecording');
    this.state.set([], 'currentRecordingTags');
    // this._currentSessionId = null;

    this.sendConfigurationToAllAUTTabs()
      .then(() => {
        this.setIconForAllAUTTabs(this.prismMonitoringIconPath);
        this.setTitleForAllAUTTabs(`PRiSMA`);
        this.markNewAction();
      });
  }

  addNewRecordingTags() {
    const currentTags = this.state.get('currentRecordingTags');
    let allTags = this.state.get('allRecordingTags') || [];

    for (let recordingName of currentTags) {
      if (!allTags.includes(recordingName)) {
        allTags.push(recordingName);
      }
    }

    this.state.set(allTags, 'allRecordingTags');
    this.markNewAction();
  }

  getAUTRecordingTags() {
    this.getFilterValues('recording-name').then(tags => {
      this.state.set(tags, 'allRecordingTags');
      this.markNewAction();
    });
  }

  async getFilterValues(filter: Filter | string): Promise<Array<any> | null> {
    const url = this.features.isFeatureOn('single-domain-aut') ? this.state.get('autURL') : null;
    let ret = null;

    // if (isNullOrUndefined(url)) {
    //   return;
    // }

    let logicalName;

    if (!isString(filter)) {
      filter = <Filter>filter;
      logicalName = filter.logicalName;

      switch (filter.type) {
        case FilterType.DATE:
          return DateFilterValues.map(({label}) => {
            return label;
          });
      }

    } else {
      logicalName = <string>filter;
    }

    try {
      let filters = {};
      if (!!url) {
        const autURL = new URL(url);
        filters['domain'] = [autURL.host];
        filters['domain'].push(this.getSecondaryURL(autURL).host);
      }
      ret = await this.api.getFilterValues(filters, logicalName).toPromise();
    } catch (e) {
      //TODO: handle error
      console.log(e);
    }

    return ret;
  }

  /*
   Filters changed
   */
  async filterEvents() {
    let query = {
      filters: {},
      fromTime: null
    };

    const selectedFilters = this.getAllFilters();

    if (!this.hasRunsSubject.getValue()) {
      // Clear highlights in case there are no runs/no recording
      // for current selection (Octane integration)
      this.prevStyle = '';
      await this.sendConfigurationToAllAUTTabs();
      return;
    }
    else {
      selectedFilters.forEach(({type, logicalName, values}) => {
        switch (type) {
          case FilterType.DATE:
            query.fromTime = DateFilterValues.find(item => {
                return item.label === values;
              }
            ).value;
            break;

          default:
            if (!query.filters[logicalName]) {
              query.filters[logicalName] = [];
            }
            query.filters[logicalName].push(values);

            break;
        }
      });
    }

    await this.getSelectorsFromAPI(query.filters, query.fromTime);
  }

  getAllFilters(): Array<SelectedFilter> {
    const currentPreset = this.state.get('selectedPresetIndex');

    return this.getPresetFilters(currentPreset);
  }

  getPresetFilters(presetIndex: number): Array<SelectedFilter> {
    let ret = null;
    const numOfEnvironments = this.state.get('presets', presetIndex, 'environments').length;

    for (let i = 0; i < numOfEnvironments; i++) {
      if (this.state.get('presets', presetIndex, 'environments', i, 'isSelected')) {
        if (isNullOrUndefined(ret)) {
          ret = [];
        }

        ret.push(...this.getEnvironmentFilters(presetIndex, i));
      }
    }

    return ret;
  }

  getEnvironmentFilters(presetIndex: number, environmentIndex: number): Array<SelectedFilter> {
    return this.state.get('presets', presetIndex, 'environments', environmentIndex, 'selectedFilters');
  }

  setEnvironmentFilters(presetIndex: number, environmentIndex: number, filters: Array<SelectedFilter>) {
    this.state.set(filters, 'presets', presetIndex, 'environments', environmentIndex, 'selectedFilters');
    this.markNewAction();
  }

  clearAllFiltersInPreset(presetIndex: number) {
    const numOfEnvironments = this.state.get('presets', presetIndex, 'environments').length;

    for (let i = 0; i < numOfEnvironments; i++) {
      this.setEnvironmentFilters(presetIndex, i, []);
    }
  }

  clearAllFilters() {
    const numOfPresets = this.state.get('presets').length;

    for (let i = 0; i < numOfPresets; i++) {
      this.clearAllFiltersInPreset(i);
    }

    this.markNewAction();
  }

  async getSelectorsFromAPI(filters, date?) {
    try {
      const url = this.features.isFeatureOn('single-domain-aut') ? this.state.get('autURL') : null;
      const isClickable = this.features.isFeatureOn('show-only-meaningful-events');

      if (!!url) {
        const autURL = new URL(url);
        filters['domain'] = [autURL.host];
        filters['domain'].push(this.getSecondaryURL(autURL).host);
      }

      const data = await this.api.getEvents(filters, date, isClickable).toPromise();
      // let style = '';
      let color = this.state.get('colorPallet', this.state.get('selectedColorIndex'));

      this.selectors = data;
      this.prevStyle = this.createHighlighterStyleWithOpacity(data, 5, color);

      await this.sendConfigurationToAllAUTTabs();
      // await this.sendCurrentURLToAgent();
    } catch (err) {
      //TODO: handle errors
      console.log('PRiSM:: Failed to get selectors');
    }
  }

  createHighlighterStyleWithOpacity(selectors: GetEventsResponse, opacityLevels: number = 5, color: string): string {
    const opacityMap = new Map<number, Set<string>>();
    const opacityStep: number = parseFloat((1 / opacityLevels).toFixed(2));
    let style = '';

    const presetIndex = this.state.get('selectedPresetIndex');
    const isManualCovered = this.state.get('presets', presetIndex, 'environments', 0, 'isCovered');

    if (this.features.isFeatureOn('selectors-opacity') && isManualCovered) {
      for (let selector in selectors) {
        const weight = selectors[selector].weight;

        if (isNullOrUndefined(opacityMap.get(weight))) {
          opacityMap.set(weight, new Set<string>());
        }

        opacityMap.get(weight).add(selector);
      }

      opacityMap.forEach((selectors, weight) => {
        style += this.createHighlighterStyle([...selectors], opacityStep * weight, color) + '\n';
      });
    } else {
      if (!isManualCovered) {
        style = 'body ';
      }
      style += this.createHighlighterStyle(Object.keys(selectors), 0.6, color);
    }

    return style;
  }

  createHighlighterStyle(selectors: Array<string>, opacity: number, color: string) {
    let style = '';

    const presetIndex = this.state.get('selectedPresetIndex');
    const isManualCovered = this.state.get('presets', presetIndex, 'environments', 0, 'isCovered');

    if (isManualCovered) {
      selectors.forEach((selector) => {
        style += selector;
        style += ', ';
      });
    } else {
      selectors.forEach((selector) => {
        style += `:not(${selector})`;
      });
    }


    if (!this.state.get('showUniqueEventsOnly')) {
      style = style.replace(/#(\S+)\s+>\s+(\.\S+)/g, '$2'); //handle ids
      style = style.replace(/(\.\S+)+(:nth-child\(\d+\))/g, '$1'); //handle classes
      style = style.replace(/(>\s+\w+)(:nth-child\(\d+\))/g, '$1'); //handle simple elements
    }

    style = style.replace(/,\s+$/, '');
    style += `{background-color: rgba(${color}, ${opacity}) !important;
               outline-color: rgba(${color}, ${opacity}) !important;
               outline-offset: -5px;
               outline-width: 5px;
               outline-style: solid;}`;

    return style;
  }

  getActiveTabURL() {
    return this.browser.activeTabURL;
  }

  async declareNewAut(): Promise<boolean> {
    const currentAUT = this.state.get('autURL');
    const activeURL = await this.browser.getActiveTabURL();
    this.lastAutTabID = this.browser.activeTabId;
    //this._currentSessionId = null;

    if (isNullOrUndefined(activeURL)) {
      console.error('BackgroundService::declareNewAut:: No active URL', activeURL);
      return false;
    }

    const newAUT = new URL(activeURL);

    // If monitoring another AUT, reload all tabs of it
    if (!!currentAUT) {
      this.stopRecording();
      await this.reloadTabsByURL(currentAUT);
    }

    // Save new AUT
    this.state.set(newAUT.origin, 'autURL');
    this.state.set(null, 'allRecordingTags');
    this.selectedFilterValues = null;
    this.clearAllFilters();

    await this.setIconForAllAUTTabs(this.prismMonitoringIconPath);

    // Monitor & send configs to AUT
    await this.monitoringExecution();
    await this.filterEvents();

    return true;
  }

  async shouldMonitor(): Promise<boolean> {
    const currentAUT = this.state.get('autURL');
    const activeURL = await this.browser.getActiveTabURL();

    if (!activeURL || !currentAUT) {
      return false;
    } else {
      // check domain with or without WWW prefix
      const url = new URL(activeURL);
      const secondaryURL = this.getSecondaryURL(url);
      return (currentAUT === url.origin || currentAUT === secondaryURL.origin);
    }
  }

  /**
   * Get the secondary URL
   * With or without www
   * @param {URL} url
   * @returns {URL}
   */
  getSecondaryURL(url: URL): URL {
    // check domain with or without WWW prefix
    const domain = url.host;
    let secondaryDomain = null;
    if (domain.startsWith('www.')) {
      secondaryDomain = domain.replace(/^www\./, '');
    } else {
      secondaryDomain = `www.${domain}`;
    }
    return new URL(`${url.protocol}//${secondaryDomain}`);
  }

  get isExtensionConfigured(): boolean {
    return this.state.get('prismBaseURL').length > 0;
  }

  async sendCurrentConfigurationToContent(tabId?: number) {
    // let currentURL = await this.browser.getActiveTabURL();

    const config = {
      tags: this.state.get('currentRecordingTags'),
      visible: this.state.get('colorAutView'),
      style: this.state.get('prevStyle'),
      prismURL: this.state.get('prismBaseURL'),
      captureEvents: this.state.get('captureEvents'),
      //sessionId: this._currentSessionId
    };

    await this.sendConfigurationToContent(config, tabId);
  }

  async injectMonitoringScripts(tabId: number): Promise<any> {
    // let scripts = ["/prism-purejs-agent.min.js", "/content_script.bundle.js"];
    let scripts = ["/content_script.bundle.js"];

    for (let script of scripts) {
      const config = {file: script, ...this.scriptInjectionDefaults};
      await this.browser.executeScript(tabId, config);
    }
  }

  async monitorAUT() {
    const url = this.state.get('autURL');
    let tabs = await this.browser.getTabs({url: `${url}/*`});

    for (let tab of tabs) {
      await this.injectMonitoringScripts(tab.id);
    }
  }

  async sendCurrentURLToAgent(): Promise<any> {

    const message = {
      message: 'ContentConfigurations',
      currentLocation: this.browser.activeTabURL
    };

    try {
      await this.browser.sendTabMessage(this.lastAutTabID, message);
      console.log('sent location: ', message);
    } catch (e) {
      console.log(e);
    }
  }

  async sendConfigurationToContent(config: ConfigurationMessage, tabId?: number): Promise<any> {
    const message = {
      message: 'ContentConfigurations',
      ...config
    };

    try {
      await this.browser.sendTabMessage(tabId, message);
      // console.log('send configuration', message);
    } catch (e) {
      console.error(e);
    }
  }

  async reloadTabsByURL(url: string): Promise<any> {
    let tabs = await this.browser.getTabs({url: this.getSearchURLPattern(url)});

    for (let tab of tabs) {
      await this.browser.reloadTab(tab.id);
    }
  }

  getSearchURLPattern(url: string): string {
    const searchURL = new URL(url);
    return `${searchURL.protocol}//*.${searchURL.host.replace(/^www\./, '')}/*`
  }

  async sendConfigurationToAllAUTTabs() {
    const url = this.state.get('autURL');

    if (!url) {
      return;
    }

    let tabs = await this.browser.getTabs({url: this.getSearchURLPattern(url)});

    for (let tab of tabs) {
      await this.sendCurrentConfigurationToContent(tab.id);
    }
  }

  async setMonitoringIconForAllAUTTabs() {
    let toolbarIcon = this.prismMonitoringIconPath;
    if (this.state.get('isRecording')) {
      toolbarIcon = this.prismRecordingIconPath;
    }
    await this.setIconForAllAUTTabs(toolbarIcon);
  }

  async setNotMonitoringIconForAllAUTTabs() {
    await this.setIconForAllAUTTabs(this.prismNotMonitoringIconPath);
  }

  async setIconForAllAUTTabs(icon: string) {
    const url = this.state.get('autURL');

    if (!url) {
      return;
    }

    let tabs = await this.browser.getTabs({url: this.getSearchURLPattern(url)});

    for (let tab of tabs) {
      this.browser.setToolbarIcon(icon, tab.id);
    }
  }

  async setTitleForAllAUTTabs(title: string) {
    const url = this.state.get('autURL');

    if (!url) {
      return;
    }

    let tabs = await this.browser.getTabs({url: this.getSearchURLPattern(url)});

    for (let tab of tabs) {
      this.browser.setToolbarTitle(title, tab.id);
    }
  }

  // async isMonitoring(): Promise<boolean> {
  //   const message = {message: 'isAlive'};
  //   try {
  //     const res = await this.browser.sendTabMessage(this.browser.activeTabId, message);
  //
  //     return res === true;
  //   } catch (e) {
  //     console.error(e);
  //     return false;
  //   }
  // }

  async monitoringExecution() {
    if (this.currentlyExecuting) {
      return;
    } else if (this.prismaConnectionError) {
      this.browser.setToolbarIcon(this.prismErrorIconPath);
      return;
    }

    try {
      this.currentlyExecuting = true;
      let should = await this.shouldMonitor();
      // Should monitor current tab?
      if (should) {
        this.state.set(new URL(await this.browser.getActiveTabURL()).origin, 'autURL');
        this.lastAutTabID = this.browser.activeTabId;
        // Set extension's icon
        let toolbarIcon = this.prismMonitoringIconPath;
        if (this.state.get('isRecording')) {
          toolbarIcon = this.prismRecordingIconPath;
        }
        await this.setIconForAllAUTTabs(toolbarIcon);
        await this.monitorAUT();
        await this.sendConfigurationToAllAUTTabs();
        await this.sendCurrentURLToAgent();
        this.currentlyExecuting = false;
        return;
      } else {
        // If shouldn't stop execution & set icon to 'not monitoring'
        this.browser.setToolbarIcon(this.prismNotMonitoringIconPath);
        console.log('Not monitoring');
        this.currentlyExecuting = false;
        return;
      }
    }
    catch (e) {
      console.log('Not monitoring');
      this.currentlyExecuting = false;
      return;
    }

  }

  selectPresetByIndex(index) {
    this.state.set(index, 'selectedPresetIndex');
  }

  async onTabRemoved() {
    try {
      await this.browser.saveToStorage(this.state.key, this.state.stateStore);
    } catch (e) {
      console.log(`StorageService:: Failed to save configurations! ${e}`);
    }
  }

  onMessage(req: any, sender: any, sendRes: any) {
    console.log("onMessage ", req);

    const testRunIdPrefix = 'Test Run ID: ';
    const testIdPrefix = 'Test ID: ';

    const autURL = this.state.get('autURL');

    if (!autURL) {
      return;
    }

    switch (req.message) {
      case 'newIframeDetected':
        // When a new IFRAME is detected - execute monitor on it
        this.monitoringExecution().then();
        break;

      case 'newEvent':
        // console.log('Background got a new event!', req);
        this.filterEvents().then();

        break;

      case 'agentHttpError':
        this.isPrismServerReachable().then();

        break;

      case 'startRecording':
        console.log('Background got a startRecording event', req);
        this.stopRecording();
        let recordingContext = req.context;

        let testRunIdRecordingName = testRunIdPrefix + recordingContext['run-id'];
        let testIdRecordingName = testIdPrefix + recordingContext['test-id'];

        this.selectPresetByIndex(0);
        this.clearAllFiltersInPreset(0);
        this.setCurrentRecordingTags(testRunIdRecordingName, testIdRecordingName);
        this.filterEvents().then();
        this.startRecording();
        this.markHasRuns(true);

        break;

      case 'stopRecording':
        console.log('Background got a stopRecording event', req);
        this.stopRecording();
        break;

      case 'showCoverage':
        console.log('Background got a showCoverage event', req);

        let coverageContext = req.context;

        // Add the relevant prefix according to the entity type
        let recordingNamePrefix;
        switch (coverageContext.type) {
          case 'test':
            recordingNamePrefix = testIdPrefix;
            break;

          case 'run':
            recordingNamePrefix = testRunIdPrefix;
            break;

          default:
            recordingNamePrefix = '';
        }

        // Add all recording names that we want to show coverage for
        let selectedFilterValues = [];
        for (let id of coverageContext.ids) {
          selectedFilterValues.push(recordingNamePrefix + id);
        }

        //this._currentSessionId = null;

        const hasRuns = (selectedFilterValues.length !== 0);
        this.markHasRuns(hasRuns);

        if (hasRuns) {
          // TODO: select preset 1 (Manual) - when automation would be implemented it should be switched here!
          this.selectPresetByIndex(0);

          let octaneFilters = selectedFilterValues.map(val => {
            return {logicalName: 'recording-name', type: FilterType.STRING,
                    label: 'Recording', values: val}
          });

          // console.log("Show Coverage for: ", octaneFilter);

          this.state.set(octaneFilters, 'presets', this.state.get('selectedPresetIndex'), 'environments', 0, 'selectedFilters');
        }
        this.filterEvents().then();

        break;
      default:
    }

    this.markNewAction();

    return true;
  }
}

export interface ConfigurationMessage {
  tags?: Array<string>,
  visible?: boolean,
  style?: string,
  prismURL?: string,
  captureEvents?: Array<string>
  sessionId?: string
}
