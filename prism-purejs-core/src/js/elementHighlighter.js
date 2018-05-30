/**
 * Created by bennun on 24/07/2017.
 * A class for highlighting DOM elements by mouse events
 */

import MouseEvents from './constants/mouseEvents';
import IsElementClickable from './isElementClickable';
import DomEventHandler from './domEventHandler';
import ElementCommon from './elementCommon';


/** eslint "require-jsdoc": ["error", {
 "require": {
    "FunctionDeclaration": true,
    "MethodDefinition": true,
    "ClassDeclaration": true
 }
 }]*/
export default class ElementHighligher {
  /**
   * constructor
   * @param {string} hoverColor - The color of the highlighter
   * when hovering elements
   * @param {string} clickableColor - The color of the highlighter
   * when hovering a clickable element
   */
  constructor({hoverColor = 'blue', clickableColor = 'green'}) {
    this.lastHighlightedElement = null;
    this.highlighterSize = 6; // in px
    this.hoverColor = hoverColor;
    this.clickableColor = clickableColor;

    this.createHoverElement({});
  }

  /**
   * Initialize the class
   */
  init() {
    this.toggleHighlighter(true);
  }

  /**
   * Toggle the highlighter
   * @param {boolean} toggle - toggle
   */
  toggleHighlighter(toggle) {
    this.isEnabled = toggle;

    if (!toggle) {
      this.elem.style.display = 'none';
      this.removeAllEventListeners();
    } else {
      this.attachEventListeners();
    }
  }

  /**
   * Attach event listeners to DOM elements
   */
  attachEventListeners() {
    DomEventHandler.bindEvent({
      event: MouseEvents.mousemove,
      element: document.body,
      callback: this.hoverOver.bind(this),
    });

    DomEventHandler.bindEvent({
      event: MouseEvents.mouseleave,
      element: document.body,
      callback: this.hideHoverElement.bind(this),
    });
  }

  /**
   * Remove all event listeners from DOM
   */
  removeAllEventListeners() {
    DomEventHandler.unbindEvent({
      event: MouseEvents.mousemove,
      element: document.body,
      callback: this.hoverOver.bind(this),
    });

    DomEventHandler.unbindEvent({
      event: MouseEvents.mouseleave,
      element: document.body,
      callback: this.hideHoverElement.bind(this),
    });
  }

  /**
   * Create a DOM Element that will highlight hovered elements
   * @param {number} opacity - The opacity of the highlighter
   */
  createHoverElement({opacity = 0.2}) {
    let hoverElem = document.createElement('div');

    hoverElem.style.position = 'absolute';
    hoverElem.style.display = 'none';
    hoverElem.style.backgroundColor = this.hoverColor;
    hoverElem.style.opacity = opacity;
    hoverElem.style.pointerEvents = 'none';
    hoverElem.style.zIndex = Number.MAX_SAFE_INTEGER;

    document.body.appendChild(hoverElem);

    this.elem = hoverElem;
  }

  /**
   * Hides the highlighter
   */
  hideHoverElement() {
    if (!this.isEnabled) {
      return;
    }

    this.elem.style.display = 'none';
    this.lastHighlightedElement = null;
  }

  /**
   * Given an event object, the highlighter will mark this element on the DOM
   * @param {Event} event - The fired event object
   */
  hoverOver(event) {
    if (!this.isEnabled) {
      return;
    }
    let target = event.target || event.srcElement;

    // ignore SVG elements when highlighting because of
    // some SVG related issues with browsers
    target = ElementCommon.getFirstParentDifferentFromSVG(target);

    if (!target || target.isSameNode(this.lastHighlightedElement)) {
      return;
    }

    if (IsElementClickable.isClickable(target) ||
      IsElementClickable.findClickableParent(target)) {
      this.elem.style.backgroundColor = this.clickableColor;
    } else {
      this.elem.style.backgroundColor = this.hoverColor;
    }

    this.lastHighlightedElement = target;

    ElementHighligher.highlightElement({
      target: target,
      highlighterElement: this.elem,
      highlighterSize: this.highlighterSize,
    });
  }

  /**
   * Highlights the given DOM element
   * @param {Element} target - the target element to highlight
   * @param {Element} highlighterElement - the highlighter DOM element
   * @param {number} highlighterSize - the highlighter size in addition to
   * the target's size
   */
  static highlightElement({target, highlighterElement, highlighterSize = 5}) {
    // if not the highlighter itself
    if (!!target && !!target.getBoundingClientRect &&
      !target.isSameNode(highlighterElement)) {
      let isRTL = (document.dir) === 'rtl';
      let doc = document.documentElement;
      let offset = target.getBoundingClientRect();

      let leftScroll = (window.pageXOffset || doc.scrollLeft) -
        (doc.clientLeft || 0);

      let topScroll = (window.pageYOffset || doc.scrollTop) -
        (doc.clientTop || 0);

      highlighterElement.style.height = target.offsetHeight +
        highlighterSize + 'px';

      highlighterElement.style.width = target.offsetWidth +
        highlighterSize + 'px';

      highlighterElement.style.top = offset.top + topScroll -
        highlighterSize / 2 + 'px';

      highlighterElement.style.bottom = offset.top + topScroll +
        target.offsetHeight + highlighterSize / 2 + 'px';

      if (isRTL) {
        highlighterElement.style.left = doc.offsetWidth -
          (offset.left - leftScroll - highlighterSize / 2) + 'px';

        highlighterElement.style.right = doc.offsetWidth - (
            offset.left - leftScroll + target.offsetWidth + highlighterSize / 2
          ) + 'px';
      } else {
        highlighterElement.style.left = offset.left + leftScroll -
          highlighterSize / 2 + 'px';

        highlighterElement.style.right = offset.left + leftScroll +
          target.offsetWidth + highlighterSize / 2 + 'px';
      }

      highlighterElement.style.display = 'block';
    }
  }
}


