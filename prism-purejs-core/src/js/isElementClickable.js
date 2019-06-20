/**
 * Created by bennun on 24/07/2017.
 * A class for determining if a DOM element is clickable / bound to click event
 */

import ElementCommon from './elementCommon';
import DomElementRoles from './constants/domElementRoles';


/** eslint "require-jsdoc": ["error", {
 "require": {
    "FunctionDeclaration": true,
    "MethodDefinition": true,
    "ClassDeclaration": true
 }
 }]*/
export default class IsElementClickable {
  /**
   * Check if a DOM element has a parent that is clickable
   * @param {Element} element - a DOM element to test
   * @param {string} event - the current event fired
   * @return {Element} - the clickable parent, returns undefined if non found
   */
  static findClickableParent(element, event) {
    let ret;

    for (let targetParent = element.parentElement;
         !!targetParent && !ElementCommon.isElementTypeOf({element: targetParent, tag: 'body'});
         targetParent = targetParent.parentElement) {
      if (!!targetParent && !!targetParent.tagName) {
        // is element clickable
        if (IsElementClickable.isClickable(targetParent, event)) {
          ret = targetParent;
          break;
        }
      }
    }

    return ret;
  }

  /**
   * Check if a DOM element is bound to any click event or is
   * a clickable element
   * @param {Element} element - a DOM element to test
   * @param {string} event - the current event fired
   * @return {boolean} - was a click event bound to the given DOM element
   */
  static isClickable(element, event) {
    return IsElementClickable.isClickableElement(element) ||
      IsElementClickable.wasClickRoleAttrFound(element) ||
      IsElementClickable.isPrismClickable(element, event);
  }

  /**
   * Check if a DOM element is bound to any click event or is
   * a clickable element
   * @param {Element} element - a DOM element to test
   * @param {string} event - the current event fired
   * @return {boolean} - was a click event bound to the given DOM element
   */
  static isPrismClickable(element, event) {
    return !!element.getAttribute(`data-prism-event--${event}`);
  }

  /**
   * Check if a DOM element has a clickable role
   * @param {Element} element - a DOM element to test
   * @return {boolean} - was a click role attribute found on DOM element
   */
  static wasClickRoleAttrFound(element) {
    if (!element.getAttribute('role')) {
      return false;
    }

    let elemRole = element.getAttribute('role');
    let list = Reflect.ownKeys(DomElementRoles);

    for (let index in list) {
      if (list.hasOwnProperty(index)) {
        if (list[index] === elemRole) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Check if a DOM element is a clickable element
   * @param {Element} element - a DOM element to test
   * @return {boolean} - if clickable
   */
  static isClickableElement(element) {
    let isClickable;

    switch (element.tagName.toLowerCase()) {
      case 'a':
      case 'button':
      case 'input':
      case 'textarea':
      case 'select':
      case 'option':
      case 'label':
        isClickable = true;

        break;
      default:
        isClickable = false;
    }

    return isClickable;
  }
}


