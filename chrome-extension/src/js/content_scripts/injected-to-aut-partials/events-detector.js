/**
 * This code listens to Event handlers that are registered / removed
 * from DOM elements & adds DOM attributes to the element
 */
export default function() {
  'use strict';

  const addEventListenerSuper = EventTarget.prototype.addEventListener;
  const removeEventListenerSuper = EventTarget.prototype.removeEventListener;

  const SPY_TAG = 'data-prism-spy';
  const SPY_EVENT_TAG = 'data-prism-event-';
  // const SPY_ELEMENT_INIT_CLASSES_TAG = 'data-prism-class';

  // const CLASSES_TO_CLEAR = [/(data-)?ng-(\w+(-)?)+\s?/ig];

  let elementUUID = 1;

  /**
   * Check that is a valid DOM event
   * @param {string} event
   * @return {boolean}
   */
  const isDOMEvent = function(event) {
    return (/^\w+$/i).test(event);
  };

  /**
   * Hijack removeEventListener, remove event attribute from element
   * when the event handler is removed.
   * @param {Array} args
   */
  EventTarget.prototype.removeEventListener = function(...args) {
    // remove actual event listener
    removeEventListenerSuper.apply(this, args);

    // dirty action - remove attributes from element
    if (this instanceof Node && this instanceof Element) {
      // check if valid event
      if (isDOMEvent(args[0])) {
        // check if attribute was added before, then remove
        if (!isNaN(parseInt(this.getAttribute(SPY_TAG)))) {
          this.removeAttribute(`${SPY_EVENT_TAG}-${args[0]}`);
        }
      }
    }
  };

  /**
   * Hijack addEventListener, adds event attribute to element
   * when the event is registered with a handler.
   * @param {Array} args
   */
  EventTarget.prototype.addEventListener = function(...args) {
    // add actual event listener
    addEventListenerSuper.apply(this, args);

    // dirty action - add attributes to element
    if (this instanceof Node && this instanceof Element) {
      // check if valid event
      if (isDOMEvent(args[0])) {
        // console.log(`DETECTED EVENT ${args[0]}`, this);
        // check if is first event registered, if not also add id attribute
        if (isNaN(parseInt(this.getAttribute(SPY_TAG)))) {
          // this.setAttribute(`${SPY_EVENT_TAG}-${args[0]}`, 'true');
          this.setAttribute(SPY_TAG, `${elementUUID}`);
          elementUUID++;
        }
        this.setAttribute(`${SPY_EVENT_TAG}-${args[0]}`, 'true');
      }
    }
  };
};
