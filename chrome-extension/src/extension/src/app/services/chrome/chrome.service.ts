import {Injectable} from "@angular/core";
import {BackgroundService} from "../background/background.service";
import {
  BrowserExecutionOptions,
  BrowserMessage,
  BrowserMessageHandler,
  BrowserTabsQuery,
  IBrowser
} from "../interfaces/IBrowser";
import {PrismConfig} from "../configuration/IConfigurationProvider";
import {isNullOrUndefined} from "util";

declare let chrome;

@Injectable()
export class ChromeService implements IBrowser {
  private _activeTabId: number;
  private _activeWindowId: number;
  private _activeTabURL: string;
  private storage = chrome.storage.sync;

  private readonly BASE_TABS_QUERY_CONFIG: BrowserTabsQuery = {};

  public get activeTabId(): number {
    return this._activeTabId;
  }

  public get activeWindowId(): number {
    return this._activeWindowId;
  }

  public get activeTabURL(): string {
    return this._activeTabURL;
  }

  constructor() {
    if (isNullOrUndefined(chrome.runtime)) {
      throw new Error('ChromeService:: Chrome is not available!');
    }

    chrome.windows.getCurrent((window) => {
      this._activeWindowId = window.id;
    });

    // Keep track of last active tab
    this.onTabActivated((info: any) => {
      this._activeTabId = info.tabId;

      if (!isNullOrUndefined(info.windowId)) {
        this._activeWindowId = info.windowId;
      }

      this.getActiveTabURL().then(url => {
        if (!isNullOrUndefined(url)) {
          this._activeTabURL = url;
        }
      });
    });

    this.onTabMoved(this.handleTabChange.bind(this));
    this.onTabDetached(this.handleTabChange.bind(this));
    this.onTabAttached(this.handleTabChange.bind(this));
    this.onWindowChanged(this.handleWindowChange.bind(this));

    // Determine active tab, only when the tab is in the focused window & is active
    this.onTabUpdated((tabId: number, changeInfo: any, tab: any) => {
      if (!isNullOrUndefined(tab.url) && tab.active === true && tab.status === 'complete') {
        if (!isNullOrUndefined(tab.windowId) && this._activeWindowId === tab.windowId) {
          this._activeTabURL = tab.url;
          this._activeTabId = tab.id;
          // console.log('ACTIVE: ', tab);
        }
      }
    });
  }

  private handleTabChange(tabId: number, info?: any) {
    if (!isNullOrUndefined(tabId)) {
      this._activeTabId = tabId;
      // this._activeWindowId = info.windowId;

      this.getActiveTabURL().then(url => {
        if (!isNullOrUndefined(url)) {
          // console.log('ACTIVE TAB: ', url);

          this._activeTabURL = url;
        }
      });
    }
  }

  private handleWindowChange(windowId) {

    if (isNullOrUndefined(windowId) || windowId === chrome.windows.WINDOW_ID_NONE) {
      return;
    }

    this._activeWindowId = windowId;

    this.getActiveTab()
      .then(tab => {
        if (!isNullOrUndefined(tab)) {
          this._activeTabURL = tab.url;
          this._activeTabId = tab.id;
        }
      })
      .catch(err => console.error(err));
  }

  public getBackgroundPage(): BackgroundService {
    return <BackgroundService>chrome.extension.getBackgroundPage().bgService;
  }

  public setToolbarIcon(path: string, tabId?: number) {
    chrome.browserAction.setIcon({
      path: path,
      tabId: tabId || this.activeTabId
    });
  }

  public setToolbarTitle(title: string, tabId?: number) {
    chrome.browserAction.setTitle({
      title: title,
      tabId: tabId || this.activeTabId
    });
  }

  public onMessage(handler: BrowserMessageHandler) {
    chrome.runtime.onMessage.addListener(handler);
  }

  public getViews(): any {
    return chrome.extension.getViews({type: 'popup'});
  }

  public onTabUpdated(handler: Function) {
    chrome.tabs.onUpdated.addListener(handler);
  }

  public onTabActivated(handler: Function) {
    chrome.tabs.onActivated.addListener(handler);
  }

  public onTabMoved(handler: Function) {
    chrome.tabs.onMoved.addListener(handler);
  }

  public onTabDetached(handler: Function) {
    chrome.tabs.onDetached.addListener(handler);
  }

  public onTabRemoved(handler: Function) {
    chrome.tabs.onRemoved.addListener(handler);
  }

  public onTabAttached(handler: Function) {
    chrome.tabs.onAttached.addListener(handler);
  }

  public onWindowChanged(handler: Function) {
    chrome.windows.onFocusChanged.addListener(handler);
  }

  public onConnect(handler: Function) {
    chrome.runtime.onConnect.addListener(handler);
  }

  public sendTabMessage(tabId: number, body: BrowserMessage, responseHandler?: Function): Promise<any> {
    return new Promise((res, rej) => {
      if (isNullOrUndefined(tabId)) {
        return rej('No tab ID provided!');
      }

      chrome.tabs.sendMessage(tabId, body, (response) => {
        res(response);
      });
    });
  }

  public sendExtensionMessage(body: BrowserMessage, responseHandler?: Function): Promise<any> {
    return new Promise((res, rej) => {
      chrome.runtime.sendMessage(body, (response) => {
        res(response);
      });
    });
  }


  public executeScript(tabId: number, options: BrowserExecutionOptions): Promise<any> {
    return new Promise((res, rej) => {
      chrome.tabs.executeScript(tabId, options, (result) => {
        // console.log(result);
        res(true);
      });
    });
  }

  public reloadTab(tabId: number): Promise<any> {
    return new Promise((res, rej) => {
      chrome.tabs.reload(tabId, () => {
        if (!isNullOrUndefined(chrome.runtime.lastError)) {
          return rej(null);
        }

        res(true);
      });
    });
  }

  public getTabs(query: BrowserTabsQuery): Promise<Array<any>> {
    return new Promise((res, rej) => {
      if (!isNullOrUndefined(chrome.runtime.lastError)) {
        return rej(null);
      }

      const newQuery = {...this.BASE_TABS_QUERY_CONFIG, ...query};

      chrome.tabs.query(newQuery, tabs => res(tabs));
    });
  }

  private getActiveTab(): Promise<any> {
    return new Promise((res, rej) => {

      const query = {
        active: true,
        // currentWindow: true
      };

      if (!isNullOrUndefined(this.activeWindowId) || this.activeWindowId !== chrome.windows.WINDOW_ID_NONE) {
        query['windowId'] = this.activeWindowId;
      }

      this.getTabs(query).then(tabs => {
        if (isNullOrUndefined(tabs) || tabs.length === 0) {
          return rej('ERROR: No active tab!' + tabs);
        } else if (tabs.length > 1) {
          return rej('Error: More than 1 active tab!' + JSON.stringify(tabs));
        }

        res(tabs[0]);
      }).catch(e => rej(e));
    });
  }

  public getActiveTabURL(): Promise<string> {
    return new Promise((res, rej) => {
      this.getActiveTab()
        .then(tab => {
          // console.log('ACTIVE TAB: ', tab.url);
          res(tab.url);
        })
        .catch(err => rej(err));
    });
  }

  public getAssetPath(asset: string): string {
    return chrome.extension.getURL(asset);
  }

  public async getPrismConfigFromFile(): Promise<PrismConfig> {
    let ret = null;

    try {
      const configPath = this.getAssetPath('prism.config');
      const configFile = await fetch(configPath, {headers: {contentType: 'application/json'}});

      ret = await configFile.json();

    } catch (e) {
      throw new Error(`ChromeService:: Config file wasn't found! ${e}`);
    }

    return ret;
  }

  public getFromStorage(key: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.storage.get([key], (items) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(items[key]);
        }
      });
    });
  }

  public saveToStorage(key: string, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let dataJSON = {};
      dataJSON[key] = data;
      this.storage.set(dataJSON, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(true);
        }
      });
    });
  }

  public clearStorage(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storage.clear(() => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(true);
        }
      });
    });
  }
}

export enum ScriptExecutionTime {
  IDLE = "document_idle",
  END = "document_end",
  START = "document_start"
}
