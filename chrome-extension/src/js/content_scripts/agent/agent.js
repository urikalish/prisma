/**
 * Created by bennun on 16/08/2017.
 * An implementation of the Prism agent. light-weight, small footprint, high-performance
 *
 * Prism agent is capable of:
 *    1. Communicating with external extensions / controllers via Prism Events
 *    2. Collecting dynamic DOM-events
 *    3. Publishing the events collected to an external data source
 *
 */

// There can be only one instance of @babel/polyfill to rule them all
if (!global._babelPolyfill) {
  require('@babel/polyfill');
}

import {EventsValidator, PrismElementModel, PrismEvents, PrismEventsHandler} from 'prism-purejs-core';

const PREVENT_EVENT_WITH_EMPTY_TAGS = true;
const NEW_EVENT_PATH = '/api/events';

/** eslint "require-jsdoc": ["error", {
 "require": {
    "FunctionDeclaration": true,
    "MethodDefinition": true,
    "ClassDeclaration": true
 }
 }]*/
export default class PrismAgent {
  /**
   * Creates a new Prism Agent
   * @param {string} baseURL - Prism Event Analyzer URL
   */
  constructor({baseURL}) {
    // init Prism agent
    this._trackedEvents = [];
    this._baseURL = baseURL;
    this._currentLocation = null;

    this.initFreshRun();

    // set default run mode to user interaction
    this.changeAgentRunMode(PrismElementModel.runManual);

    // console.log(strings.loaded.replace('$0', __VERSION__));
  }

  /**
   * The entry-point for creating a new agent for the AUT
   * @param {string} baseURL - Prism Event Analyzer URL
   * @return {PrismAgent}
   */
  static initAgentInstance({baseURL}) {
    if (!this._agent) {
      this._agent = new PrismAgent({baseURL});
    }

    return this._agent;
  }

  /**
   * Set the current session tags
   * @param {string} tags
   */
  setTags(tags) {
    this._eventTags = tags;
  }

  /**
   * Init the agent for a fresh run
   */
  initFreshRun() {
    // the browser DOM events
    this._capturedEvents = [];
    this._trackedEvents = [];

    // meta-data
    this._eventTags = null;

    // agent settings
    this._currentLocation = null;
    this._baseURL = null;
    this._sessionId = null;
  }

  /**
   * Change the run mode of the agent
   * @param {string} mode
   */
  changeAgentRunMode(mode) {
    this._runMode = mode;
  }

  /**
   * Setter for baseURL - Prism Event Analyzer URL
   * @param {string} baseURL
   */
  setBaseURL(baseURL) {
    this._baseURL = baseURL;
  }

  /**
   * Setter for the current AUT location
   * @param {string} location
   */
  setCurrentLocation(location) {
    if (!!location) {
      this._currentLocation = new URL(location);

      while (this._capturedEvents.length > 0) {
        const event = this._capturedEvents.pop();
        this.eventHandler(event);
      }
    }
  }

  /**
   * Setter for the current session-id
   * @param {string} id
   */
  setSessionId(id) {
    this._sessionId = id;
  }

  /**
   * Handles an event fired in the AUT, return when no tags are set
   * @param {Event} event
   */
  async eventHandler(event) {
    // If no tags, don't send event
    if (PREVENT_EVENT_WITH_EMPTY_TAGS) {
      if (!this._eventTags || this._eventTags.length === 0) {
        return;
      }
    }

    if (!this._currentLocation) {
      this._capturedEvents.push(event);
      return;
    }

    // create prism event object & apply meta-data
    let prismElement = new PrismElementModel(event);

    prismElement.applyLocation(this._currentLocation);
    prismElement.applyRunMode(this._runMode);
    prismElement.applyTags(this._eventTags);
    prismElement.applySessionId(this._sessionId);

    // send event to backend
    try {
      await this.postEvent(this._baseURL, prismElement._model);
      // notify that a new event was sent (for the content script)
      PrismEventsHandler.fireEvent({event: PrismEvents.sendData});
    } catch (e) {
      console.log(e);
      PrismEventsHandler.fireEvent({event: PrismEvents.runtimeError});
    }
  }

  /**
   * Apply the DOM-events listeners for Prism Agent
   * @param {Array} events
   */
  listenToEvents(events) {
    // if already tracking events, return
    if (this._trackedEvents.length > 0) {
      return;
    }
    // console.log(`${strings.monitoringEvents}\n${validEvents.toString()}`);

    // save the events in the AUT configurations
    this._trackedEvents = EventsValidator.validateEventsArray(events);

    // for (let i = 0; i < validEvents.length; i++) {
    this._trackedEvents.forEach((event) => {
      document.addEventListener(event, async (e) => {
        try {
          await this.eventHandler.bind(this)(e);
        } catch (err) {
          console.log(err);
        }
      }, true);
    });
  }

  /**
   * Send the PrismEvent via HTTP post request
   * @param {String} url
   * @param {Object} data
   * @return {Promise}
   */
  async postEvent(url, data) {
    const res = await fetch(url + NEW_EVENT_PATH, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(data),
      headers: {'Content-Type': 'application/json'},
    });

    return await res.json();
  }
}

// // make agent available as a global variable
// if (window.PrismAgent === undefined) {
//   window.PrismAgent = PrismAgent;
// } else {
//   console.log('The agent is already');
// }

