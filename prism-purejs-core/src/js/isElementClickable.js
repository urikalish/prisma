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
   * @return {Element} - the clickable parent, returns undefined if non found
   */
  static findClickableParent(element) {
    let ret;

    for (let targetParent = element.parentElement;
         !!targetParent && !ElementCommon.isElementTypeOf({element: targetParent, tag: 'body'});
         targetParent = targetParent.parentElement) {
      if (!!targetParent && !!targetParent.tagName) {
        // is element clickable
        if (IsElementClickable.isClickable(targetParent)) {
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
   * @return {boolean} - was a click event bound to the given DOM element
   */
  static isClickable(element) {
    return IsElementClickable.isClickableElement(element) ||
      IsElementClickable.wasClickRoleAttrFound(element) ||
      IsElementClickable.isAngularClickEvent(element);
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
   * Check if a DOM element is bound to an Angular click event
   * @param {Element} element - a DOM element to test
   * @return {boolean} - was a click event bound to the given DOM element
   */
  static isAngularClickEvent(element) {
    let angularAttrs = [
      'ng-click', 'data-ng-click',
      'ng-mousedown', 'data-ng-mousedown',
      'ng-mouseup', 'data-ng-mouseup'];

    for (let i = 0; i < angularAttrs.length; i++) {
      if (!!element.getAttribute(angularAttrs[i])) {
        return true;
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

  /**
   * Check if a DOM element is a jQuery clickable element
   * @param {Element} element - a DOM element to test
   * @return {boolean} - if clickable
   */
  static isJqueryClickable(element) {
    if (!jQuery) {
      return false;
    } else {
      let events = jQuery._data(element, 'events');

      if (!!events) {
        // console.log(events);
        return !!events['click'] && events['click'].delegateCount !== undefined &&
          events['click'].delegateCount === 0;
      }
    }
  }
}


