/**
 * Created by bennun on 07/08/2017.
 */

import DomEventHandler from './domEventHandler';

/** eslint "require-jsdoc": ["error", {
 "require": {
    "FunctionDeclaration": true,
    "MethodDefinition": true,
    "ClassDeclaration": true
 }
 }]*/
export default class PrismEventHandler {
  /**
   * Execute a callback when event fired
   * @param {string} event - the event to listen to
   * @param {function} callback - the function to execute when the event
   * is fired
   */
  static onEvent({event, callback}) {
    DomEventHandler.bindEvent({
      event: event,
      callback: callback,
      element: document,
    });
  }

  /**
   * Bind an event to a given element
   * @param {string} event - the event to bind
   * @param {object} data - the DOM element to bind the event to
   */
  static fireEvent({event, data = undefined}) {
    let eventObj = document.createEvent('Event');

    eventObj.initEvent(event, true, true);
    eventObj.data = data;

    document.dispatchEvent(eventObj);
  }
}


