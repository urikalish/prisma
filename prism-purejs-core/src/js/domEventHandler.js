/**
 * Created by bennun on 30/07/2017.
 * A class to handle event binding / unbinding
 * IE9+ / Edge / Firefox / Chrome compatible
 */

/** eslint "require-jsdoc": ["error", {
 "require": {
    "FunctionDeclaration": true,
    "MethodDefinition": true,
    "ClassDeclaration": true
 }
 }]*/
export default class DomEventHandler {
  /**
   * Bind an event to a given element
   * @param {string} event - the event to bind
   * @param {object} element - the DOM element to bind the event to
   * @param {boolean} useCapture - a boolean to determine if the
   * event is fired
   * by capture / bubbling
   * @param {function} callback - the function to execute when the
   * event is fired
   */
  static bindEvent({event, element, callback, useCapture = true}) {
    if (!!element.addEventListener) {
      element.addEventListener(event, callback, useCapture);
    } else if (!!element.attachEvent) {
      element.attachEvent('on' + event, callback);
    }
  }

  /**
   * Unbind an event from a given element
   * @param {string} event - the event to unbind
   * @param {object} element - the DOM element to unbind the event from
   * @param {boolean} useCapture - a boolean to determine if the
   * event is fired
   * by capture / bubbling
   * @param {function} callback - the function to execute when the
   * event is fired
   */
  static unbindEvent({event, element, callback, useCapture = true}) {
    if (!!element.removeEventListener) {
      element.removeEventListener(event, callback, useCapture);
    } else if (!!element.detachEvent) {
      element.detachEvent('on' + event, callback);
    }
  }
}


