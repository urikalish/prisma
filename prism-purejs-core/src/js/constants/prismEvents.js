/**
 * Created by bennun on 07/08/2017.
 * Constants for Prism modules communication
 */

/** eslint "require-jsdoc": ["error", {
 "require": {
    "FunctionDeclaration": true,
    "MethodDefinition": true,
    "ClassDeclaration": true
 }
 }]*/
export default class PrismEvents {
  /**
   * Constant for base event name
   * @return {string}
   */
  static get prism() {
    return 'prism::';
  }

  /**
   * Constant for base request
   * @return {string}
   */
  static get request() {
    return `${PrismEvents.prism}request::`;
  }

  /**
   * Constant for base response
   * @return {string}
   */
  static get respond() {
    return `${PrismEvents.prism}respond::`;
  }

  /**
   * Constant for base notification
   * @return {string}
   */
  static get notify() {
    return `${PrismEvents.prism}notify::`;
  }

  /**
   * Constant for base setting
   * @return {string}
   */
  static get set() {
    return `${PrismEvents.prism}set::`;
  }

  /**
   * Constant for request AUT data
   * @return {string}
   */
  static get requestAUTData() {
    return `${PrismEvents.request}AUTData`;
  }

  /**
   * Constant for response AUT data
   * @return {string}
   */
  static get respondAUTData() {
    return `${PrismEvents.respond}AUTData`;
  }

  /**
   * Constant for request AUT DOM tracked events
   * @return {string}
   */
  static get requestTrackedEvents() {
    return `${PrismEvents.request}trackedEvents`;
  }

  /**
   * Constant for respond AUT DOM tracked events
   * @return {string}
   */
  static get respondTrackedEvents() {
    return `${PrismEvents.respond}trackedEvents`;
  }

  /**
   * Constant for requesting the captured events from the agent (before sent to API)
   * @return {string}
   */
  static get requestCapturedEvents() {
    return `${PrismEvents.request}capturedEvents`;
  }

  /**
   * Constant for respond the captured events from the agent (before sent to API)
   * @return {string}
   */
  static get respondCapturedEvents() {
    return `${PrismEvents.respond}capturedEvents`;
  }

  /**
   * Constant Set agent's recording to manual
   * @return {string}
   */
  static get setAgentRecordingModeToManual() {
    return `${PrismEvents.set}agentRecordingModeToManual`;
  }

  /**
   * Constant Set agent's recording to manual
   * @return {string}
   */
  static get setAgentRecordingModeToAutomation() {
    return `${PrismEvents.set}agentRecordingModeToAutomation`;
  }

  /**
   * Constant Set agent's tags for Prism-model
   * @return {string}
   */
  static get setAgentTags() {
    return `${PrismEvents.set}agentTags`;
  }

  /**
   * Constant notify that Prism extension is loaded in the page
   * @return {string}
   */
  static get notifyExtensionLoaded() {
    return `${PrismEvents.notify}extensionLoaded`;
  }

  /**
   * Constant notify that Prism extension is loaded in the page
   * @return {string}
   */
  static get notifyAgentLoaded() {
    return `${PrismEvents.notify}agentLoaded`;
  }

  /**
   * Constant start / stop manual recording
   * @return {string}
   */
  static get toggleRecord() {
    return `${PrismEvents.prism}toggleRecord`;
  }

  /**
   * Constant send data to API
   * @return {string}
   */
  static get sendData() {
    return `${PrismEvents.prism}sendData`;
  }

  /**
   * Constant send a runtime error
   * @return {string}
   */
  static get runtimeError() {
    return `${PrismEvents.prism}runtime::error`;
  }
}
