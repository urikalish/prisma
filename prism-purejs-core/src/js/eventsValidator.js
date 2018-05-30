/**
 * Created by bennun on 21/08/2017.
 */

import DomEvents from './constants/domEvents';
import KeyboardEvents from './constants/keyboardEvents';
import MouseEvents from './constants/mouseEvents';
import {eventsValidator as strings} from './../core-strings.json';

/** eslint "require-jsdoc": ["error", {
 "require": {
    "FunctionDeclaration": true,
    "MethodDefinition": true,
    "ClassDeclaration": true
 }
 }]*/
export default class EventsValidator {
  /**
   * A list of forbidden events - these might cause low-performance, high network usage or not UI related
   * @return {Array}
   */
  static get blackList() {
    let ret = [
      MouseEvents.mousemove, MouseEvents.mouseover, MouseEvents.mouseleave,
      MouseEvents.mouseout, MouseEvents.mouseenter, DomEvents.load, DomEvents.error,
      DomEvents.copy, DomEvents.cut, DomEvents.paste, DomEvents.focusin, DomEvents.focusout,
      DomEvents.hashchange, DomEvents.reset, DomEvents.resize, DomEvents.unload,
      DomEvents.select, DomEvents.submit,
    ];

    return ret;
  }

  /**
   * Returns a list of permitted events
   * @return {Array}
   */
  static get whiteList() {
    let ret;

    let dom = Reflect.ownKeys(DomEvents);
    let kb = Reflect.ownKeys(KeyboardEvents);
    let mouse = Reflect.ownKeys(MouseEvents);

    ret = new Set([...dom, ...kb, ...mouse]);

    let blacklist = ['length', 'prototype', 'name', ...EventsValidator.blackList];

    for (let item of blacklist) {
      ret.delete(item);
    }

    return [...ret];
  }

  /**
   * Validates & sanitizes a list of events, proper warnings are shown when forbidden / unknown events are present
   * @param {Array} events - the events to validate
   * @return {Array} - sanitized array of events
   */
  static validateEventsArray(events) {
    let ret = new Set(); // use set to prevent duplicates
    let usedBlacklist = [];
    let usedUnknown = [];

    let blackList = EventsValidator.blackList;
    let whiteList = EventsValidator.whiteList;

    for (let event of events) {
      let cleanEvent = event.replace(/^on/i, '').trim();

      if (blackList.indexOf(cleanEvent) !== -1) { // if in blacklist
        usedBlacklist.push(event);
      } else if (whiteList.indexOf(cleanEvent) !== -1) { // if in whitelist
        ret.add(cleanEvent);
      } else { // if unknown
        usedUnknown.push(event);
      }
    }

    if (usedBlacklist.length > 0) {
      console.error(`${strings.blacklist}\n${usedBlacklist.toString()}`);
    }

    if (usedUnknown.length > 0) {
      console.warn(`${strings.unknown}\n${usedUnknown.toString()}`);
    }

    if (usedBlacklist.length > 0 || usedUnknown.length > 0) {
      console.info(`${strings.whitelist}\n${whiteList}`);
    }

    return [...ret]; // return as an array
  }
}


