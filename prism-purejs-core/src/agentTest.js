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
import {DomEventHandler, EventsValidator, PrismElementModel, PrismEvents, PrismEventsHandler} from './index';

import {agent as strings} from './agent-strings.json';

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

    this._didPrismEventInited = false;
    this.initPrismEvents();
    this.initFreshRun();

    // the aut configurations
    // this._aut = new AUTConfigurations({appName, environment, product, productURL, tenantID, ctClient, ctSecret});

    // gather the client's details
    // this._clientBrowser = DetectBrowser.clientBrowser();

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
                data: this._trackedEvents,
              });
            },
          });

          // Send the AUT tracked events to the requester
          PrismEventsHandler.onEvent({
            event: PrismEvents.requestCapturedEvents,
            callback: (event) => {
              PrismEventsHandler.fireEvent({
                event: PrismEvents.respondCapturedEvents,
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
    // this._runStep++;
    let prismElement = new PrismElementModel(event);

    // prismElement.applyAUTData(this._aut.autData);
    // prismElement.applyBrowserData(this._clientBrowser);
    prismElement.applyRunMode(this._runMode);
    // prismElement.applyRunStep(this._runStep);

    if (!!this._eventTags) {
      prismElement.applyTags(this._eventTags);
    }

    this.sendEventToPrismAPI(this._baseURL, prismElement._model);
    // this._capturedEvents.push(prismElement);
  }

  /**
   * Apply the DOM-events listeners for Prism Agent
   * @param {Array} events
   */
  listenToEvents(events) {
    let validEvents = EventsValidator.validateEventsArray(events);
    console.log(`${strings.monitoringEvents}\n${validEvents.toString()}`);

    // save the events in the AUT configurations
    this._trackedEvents = validEvents;

    // for (let i = 0; i < validEvents.length; i++) {
    this._trackedEvents.forEach((event) => {
      DomEventHandler.bindEvent({
        event: event,
        element: document.body,
        callback: this.eventHandler.bind(this),
      });
    });
  }

  // /**
  //  * Extends Prism functionality - Allows to declare CSS classes to represent user clickable elements
  //  * @param {Array} classes
  //  */
  // declareClickableClasses(classes) {
  //   this._aut.clickableClasses = classes;
  // }
  //
  // /**
  //  * Extends Prism functionality - Allows to declare CSS classes to represent user meaningless classes
  //  * For example: dynamic classes that are added on hover, on focus, on
  //  * @param {Array} classes
  //  */
  // declareMeaninglessClasses(classes) {
  //   this._aut.meaninglessClasses = classes;
  // }

  /**
   * BOOP
   * @param {String} url
   * @param {Object} data
   * @param {boolean} ajax
   */
  sendEventToPrismAPI(url, data, ajax = true) {
    if (ajax) {
      if (!!window.fetch) {
        fetch(url + NEW_EVENT_PATH, {
          method: 'POST',
          mode: 'CORS',
          body: JSON.stringify(data),
          headers: {'Content-Type': 'application/json'},
        }).then((res) => {
          console.log('sent event ', res);
        }).catch((err) => {
          console.error(err);
        });
      } else {
        console.log('FETCH API IS N/A');
      }
    } else { // Send DATA via pixel image
      if (!this.imgElement) {
        this.imgElement = document.createElement('img');
        document.body.appendChild(this.imgElement);
      }
      this.imgElement.crossOrigin = 'Anonymous';
      this.imgElement.src = url + '/_data.gif?data=' + encodeURIComponent(JSON.stringify(data));
    }
  }
}

// make agent available as a global variable
window.PrismAgent = PrismAgent;
