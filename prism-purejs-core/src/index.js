/**
 * Created by bennun on 06/08/2017.
 * This file is the entry-point for Prism-Core, all exported values can be used by the package consumer
 */

import PrismEvents from './js/constants/prismEvents';
import MouseEvents from './js/constants/mouseEvents';
import KeyboardEvents from './js/constants/keyboardEvents';
import DomEvents from './js/constants/domEvents';
import AUTConfigurations from './js/autConfigurations';
import DetectBrowser from './js/detectBrowser';
import DomEventHandler from './js/domEventHandler';
import ElementCommon from './js/elementCommon';
import ElementHighligher from './js/elementHighlighter';
import PrismEventsHandler from './js/prismEventHandler';
import PrismElementModel from './js/prismElementModel';
import PrismStorageManager from './js/prismStorageManager';
import Sanitizer from './js/sanitizer';
import EventsValidator from './js/eventsValidator';

export {
  AUTConfigurations,
  DetectBrowser,
  DomEventHandler,
  DomEvents,
  ElementCommon,
  ElementHighligher,
  EventsValidator,
  KeyboardEvents,
  MouseEvents,
  PrismEvents,
  PrismEventsHandler,
  PrismElementModel,
  PrismStorageManager,
  Sanitizer,
};

// console.log(`Prism Core VER:${__VERSION__} loaded!`);


