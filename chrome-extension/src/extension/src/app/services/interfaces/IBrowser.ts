import {BackgroundService} from "../background/background.service";
import {PrismConfig} from "../configuration/IConfigurationProvider";
import {InjectionToken} from "@angular/core";

/**
 * Interface for Browsers, implement these to create a new browser
 * adapter
 */
export interface IBrowser {
  readonly activeTabId: number,
  readonly activeWindowId: number,
  readonly activeTabURL: string,
  getBackgroundPage(): BackgroundService,
  getViews(): any,
  setToolbarIcon(path: string, tabId?: number): void,
  setToolbarTitle(title: string, tabId?: number): void,
  onConnect(handler: Function): void,
  onMessage(handler: BrowserMessageHandler): void,
  onTabUpdated(handler: Function): void,
  onTabActivated(handler: Function): void,
  onTabMoved(handler: Function): void,
  onTabAttached(handler: Function): void,
  onTabDetached(handler: Function): void,
  onTabRemoved(handler: Function): void,
  onWindowChanged(handler: Function): void,
  sendTabMessage(tabId: number, body: BrowserMessage, responseHandler?: Function): Promise<any>,
  sendExtensionMessage(body: BrowserMessage, responseHandler?: Function): Promise<any>,
  executeScript(tabId: number, options: BrowserExecutionOptions): Promise<any>,
  reloadTab(tabId: number): Promise<any>,
  getTabs(query: BrowserTabsQuery): Promise<Array<any>>,
  getActiveTabURL(): Promise<string>,
  getAssetPath(asset: string): string,
  getPrismConfigFromFile(): Promise<PrismConfig>
  saveToStorage(key: string, value: any): Promise<any>,
  getFromStorage(key: any): Promise<any>
  clearStorage(): Promise<any>
}

export const BROWSER_INJECTION = new InjectionToken<IBrowser>('extension-browser');

export interface BrowserMessage {
  message: string,
  [propName: string]: any
}

export interface BrowserMessageHandler {
  (message: any, sender: any, responseHandler: Function)
}

export interface BrowserExecutionOptions {
  allFrames?: boolean,
  code?: string,
  file?: string,
  frameId?: number,
  matchAboutBlank?: boolean,
  runAt?: string
}

export interface BrowserTabsQuery {
  active?: boolean,
  currentWindow?: boolean,
  url?: string | Array<string>
}
