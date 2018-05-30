/**
 * Created by bennun on 16/08/2017.
 * An implementation of the Prism agent. light-weight, small footprint, high-performance & cross-browser compatible
 *
 * Prism agent is capable of:
 *    1. Communicating with external extensions / controllers via Prism Events
 *    2. Collecting dynamic DOM-events
 *    3. Publishing the events collected to an external data source
 *    4.
 */
import {
  AUTConfigurations,
  DetectBrowser,
  DomEventHandler,
  EventsValidator,
  PrismElementModel,
  PrismEvents,
  PrismEventsHandler,
} from 'prism-purejs-core';

import {agent as strings} from './agent-strings.json';

// let ctAPI;
//
// if (__API_MOCKUP__) {
//   ctAPI = require('./js/mockups/controlTowerAPI');
// } else {
//   console.log('loaded real API');
// }

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
   * @param {string} appName
   * @param {string} environment - The environment the agent is deployed on
   * @param {string} product - ALM / Octane
   * @param {string} productURL
   * @param {string} tenantID
   * @param {string} ctClient - client data for Control Tower
   * @param {string} ctSecret - client data for Control Tower
   */
  constructor({appName, environment, product, productURL, tenantID, ctClient, ctSecret}) {
    // init Prism agent
    this._didPrismEventInited = false;
    this.initPrismEvents();
    this.initFreshRun();

    // the aut configurations
    this._aut = new AUTConfigurations({appName, environment, product, productURL, tenantID, ctClient, ctSecret});

    // gather the client's details
    this._clientBrowser = DetectBrowser.clientBrowser();

    // set default run mode to user interaction
    this.changeAgentRunMode(PrismElementModel.runUser);


    PrismEventsHandler.fireEvent({
      event: PrismEvents.notifyAgentLoaded,
    });
    //
    // this._ctAPI = new ctAPI({
    //   ctURL: '',
    //   ctClient: ctClient,
    //   ctSecret: ctSecret
    // });

    // console.log(this._ctAPI.getToken());

    console.log(strings.loaded.replace('$0', __VERSION__));
  }

  /**
   * The entry-point for creating a new agent for the AUT
   * @param {string} appName
   * @param {string} environment - The environment the agent is deployed on
   * @param {string} product - ALM / Octane
   * @param {string} productURL
   * @param {string} tenantID
   * @param {string} ctClient - client data for Control Tower
   * @param {string} ctSecret - client data for Control Tower
   * @return {PrismAgent}
   */
  static initAgentInstance({appName, environment, product, productURL, tenantID, ctClient, ctSecret}) {
    if (!this._agent) {
      this._agent = new PrismAgent({appName, environment, product, productURL, tenantID, ctClient, ctSecret});
    }

    return this._agent;
  }

  /**
   * Initialize Prism events for the agent when Prism extension is found
   */
  initPrismEvents() {
    // Bind prism events only once on extension load
    PrismEventsHandler.onEvent({
      event: PrismEvents.notifyExtensionLoaded,
      callback: (event) => {
        if (!this._didPrismEventInited) {
          console.log('Prism extension detected');

          // Change agent's mode to manual
          PrismEventsHandler.onEvent({
            event: PrismEvents.setAgentRecordingModeToManual,
            callback: (event) => {
              this.changeAgentRunMode(PrismElementModel.runManual);
            },
          });

          // Send the AUT data to the requester
          PrismEventsHandler.onEvent({
            event: PrismEvents.requestAUTData,
            callback: (event) => {
              PrismEventsHandler.fireEvent({
                event: PrismEvents.respondAUTData,
                data: this._aut.autData,
              });
            },
          });

          // Send the AUT tracked events to the requester
          PrismEventsHandler.onEvent({
            event: PrismEvents.requestTrackedEvents,
            callback: (event) => {
              PrismEventsHandler.fireEvent({
                event: PrismEvents.respondTrackedEvents,
                data: this._aut.trackedEvents,
              });
            },
          });

          // Send the AUT tracked events to the requester
          PrismEventsHandler.onEvent({
            event: PrismEvents.requestCaputuredEvents,
            callback: (event) => {
              PrismEventsHandler.fireEvent({
                event: PrismEvents.respondCaputuredEvents,
                data: this._capturedEvents,
              });
            },
          });

          // Set agent's run tags from an outer source
          PrismEventsHandler.onEvent({
            event: PrismEvents.setAgentTags,
            callback: (event) => {
              this._eventTags = event.data;
            },
          });
        }
      },
    });
  }

  /**
   * For testing messaging
   */
  fireTestEvents() {
    PrismEventsHandler.fireEvent({event: PrismEvents.notifyExtensionLoaded});
    PrismEventsHandler.fireEvent({event: PrismEvents.setAgentRecordingModeToManual});
    PrismEventsHandler.fireEvent({event: PrismEvents.setAgentTags, data: ['tag1', 'tag2']});
  }

  /**
   * Init the agent for a fresh run
   */
  initFreshRun() {
    // the browser DOM events
    this._capturedEvents = [];
    this._runStep = 0;

    // meta-data
    this._eventTags = undefined;
  }

  /**
   * Change the run mode of the agent
   * @param {string} mode
   */
  changeAgentRunMode(mode) {
    this._runMode = mode;
  }

  /**
   * Handles an event fired in the AUT
   * @param {Event} event
   */
  eventHandler(event) {
    this._runStep++;
    let prismElement = new PrismElementModel(event);

    prismElement.applyAUTData(this._aut.autData);
    prismElement.applyBrowserData(this._clientBrowser);
    prismElement.applyRunMode(this._runMode);
    prismElement.applyRunStep(this._runStep);

    if (!!this._eventTags) {
      prismElement.applyTags(this._eventTags);
    }

    this._capturedEvents.push(prismElement);
  }

  /**
   * Apply the DOM-events listeners for Prism Agent
   * @param {Array} eventsArray
   */
  listenToEvents(eventsArray) {
    let validEvents = EventsValidator.validateEventsArray(eventsArray);
    console.log(`${strings.monitoringEvents}\n${validEvents.toString()}`);

    // save the events in the AUT configurations
    this._aut.trackedEvents = validEvents;

    for (let i = 0; i < validEvents.length; i++) {
      DomEventHandler.bindEvent({
        event: validEvents[i],
        element: document.body,
        callback: this.eventHandler.bind(this),
      });
    }
  }
}

// make agent available as a global variable
window.PrismAgent = PrismAgent;

