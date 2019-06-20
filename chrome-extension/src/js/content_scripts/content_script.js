'use strict';

import {PrismEvents, PrismEventsHandler} from 'prism-purejs-core';
import DomObserver from './dom-observer';
import PrismAgent from './agent/agent';

// IIFE for creating scope & to allow script break with 'return'
// to prevent multiple executions (line 8)
(function() {
  if (window.injectedContent) {
    console.log('content already initiated!!!!!');
    return;
  } else {
    console.log('1st time');
  }
  window.injectedContent = true;

  // Observe the DOM & inform background on new IFRAME elements in DOM
  let domObserver;
  domObserver = new DomObserver({
    rootElement: document.documentElement,
    callback: (mutation) => {
      try {
        if (!!mutation.addedNodes) {
          for (let node of mutation.addedNodes) {
            if (!!node.tagName && node.tagName.toLowerCase() === 'iframe') {
              node.addEventListener('load', function() {
                // console.log('IFRAME LOADED!');
                chrome.runtime.sendMessage({message: 'newIframeDetected'});
              });
            }
          }
        }
      } catch (e) {
        console.log(e);
      }
    },
  });

  domObserver.observe();

  // init function
  const initContent = function() {
    let prevStyleElement;
    let port;

    // will be later be tracked with a proxy to observe & react to changes
    const contentConfiguration = {
      agent: null,
      tags: null,
      events: null,
      location: null,
      prismBaseURL: null,
      style: null,
      visible: null,
      sessionId: null,
    };

    const removeStyleFromPage = () => {
      if (!!prevStyleElement) {
        document.head.removeChild(prevStyleElement);
        prevStyleElement = null;
      }
    };

    const addStyleToPage = (cssString) => {
      removeStyleFromPage();

      let styleSheet = document.createElement('style');
      styleSheet.type = 'text/css';
      styleSheet.id = 'prism-stylesheet';

      styleSheet.innerText = cssString;
      document.head.appendChild(styleSheet);

      prevStyleElement = styleSheet;
    };

    const handleStyleChange = (visible, style) => {
      if (visible) {
        addStyleToPage(style);
      } else {
        removeStyleFromPage();
      }
    };

    // Handler for configurations (Read ES6+ proxy)
    const configurationHandler = {
      set(target, key, value) {
        // if (value === target[key]) {
        //   return true;
        // }

        switch (key) {
          case 'agent':
            if (!!target.location) {
              value.setCurrentLocation(target.location);
            }

            break;

          case 'events':
            if (!!target.agent) {
              target.agent.listenToEvents(value);
            }
            break;

          case 'tags':
            if (!!target.agent) {
              target.agent.setTags(value);
            }
            break;

          case 'location':
            if (!!target.agent) {
              // console.log('Set location for agent', value);

              target.agent.setCurrentLocation(value);
            } else {
              console.log('Couldnt set location for agent', value);
            }
            break;

          case 'prismBaseURL':
            if (!!target.agent) {
              target.agent.setBaseURL(value);
            }
            break;

        /*  case 'sessionId':
            if (!!target.agent) {
              target.agent.setSessionId(value);
            }
            break;*/

          case 'visible':
            handleStyleChange(value, target.style);
            break;
          case 'style':
            handleStyleChange(target.visible, value);
            break;
        }

        target[key] = value;
        return true;
      },
    };

    const configuration = new Proxy(contentConfiguration, configurationHandler);
    configuration.agent = PrismAgent.initAgentInstance({baseURL: ''});

    // Receive 'newEvent' message from agent & pass it to the background
    PrismEventsHandler.onEvent({
      event: PrismEvents.sendData,
      callback: () => {
        chrome.runtime.sendMessage(
          {message: 'newEvent'});
      },
    });

    PrismEventsHandler.onEvent({
      event: PrismEvents.runtimeError,
      callback: () => {
        chrome.runtime.sendMessage(
          {message: 'agentHttpError'});
      },
    });

    const keepAlive = () => {
      port = chrome.runtime.connect({name: 'prism-content-script'});
      port.onMessage.addListener(() => {
        // console.log('connected');

        // Add onDisconnected only when a connections was made to BG
        port.onDisconnect.addListener(() => {
          window.location.reload();
        });
      });
    };

    const initChromeMessages = (configuration) => {
      // Declare message handlers
      chrome.runtime.onMessage.addListener((req, sender, sendRes) => {
        console.log(req);

        switch (req.message) {
          case 'isAlive':
            sendRes(true);

            return true;
            break;

          case 'ContentConfigurations':
            // Set agent's tag
            if (req.tags !== undefined) {
              configuration.tags = req.tags.map((tag) => {
                return {'value': tag};
              });
            }

            // Set content location
            if (req.currentLocation !== undefined) {
              configuration.location = req.currentLocation;
            }

            // Set new style
            if (req.style !== undefined) {
              configuration.style = req.style;
            }

            // Set session-id
            /* if (req.sessionId !== undefined) {
              configuration.sessionId = req.sessionId;
            }*/

            // Set style visibility
            if (req.visible !== undefined) {
              configuration.visible = req.visible;
            }

            // Set agent's baseURL
            if (!!req.prismURL) {
              configuration.prismBaseURL = req.prismURL;
            }

            // Set captured events in AUT
            if (req.captureEvents !== undefined) {
              configuration.events = req.captureEvents;
            }

            break;

          default:
        }
      });
    };

    keepAlive();
    initChromeMessages(configuration);
  };

  // run content init only when DOM loaded
  // if (document.readyState === 'complete') {
  initContent();
  // } else {
  //   document.addEventListener('DOMContentLoaded', initContent, false);
  // }
})();
