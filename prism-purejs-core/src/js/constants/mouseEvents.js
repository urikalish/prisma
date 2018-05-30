/**
 * Created by bennun on 03/08/2017.
 * Constants for Mouse events, from W3
 * https://www.w3.org/TR/DOM-Level-3-Events/#event-types
 */

/** eslint "require-jsdoc": ["error", {
 "require": {
    "FunctionDeclaration": true,
    "MethodDefinition": true,
    "ClassDeclaration": true
 }
 }]*/
export default class MouseEvents {
  /**
   * Constant for click
   * @return {string}
   */
  static get click() {
    return 'click';
  }

  /**
   * Constant for double click
   * @return {string}
   */
  static get dblclick() {
    return 'dblclick';
  }

  /**
   * Constant right click
   * @return {string}
   */
  static get contextmenu() {
    return 'contextmenu';
  }

  /**
   * Constant mouse wheel
   * @return {string}
   */
  static get mousewheel() {
    return 'mousewheel';
  }

  /**
   * Constant click down
   * @return {string}
   */
  static get mousedown() {
    return 'mousedown';
  }

  /**
   * Constant click up
   * @return {string}
   */
  static get mouseup() {
    return 'mouseup';
  }

  /**
   * Constant mouse enters element
   * @return {string}
   */
  static get mouseenter() {
    return 'mouseenter';
  }

  /**
   * Constant mouse leaves element
   * @return {string}
   */
  static get mouseleave() {
    return 'mouseleave';
  }

  /**
   * Constant mouse over an element
   * @return {string}
   */
  static get mousemove() {
    return 'mousemove';
  }

  /**
   * Constant mouse over an element or its children
   * @return {string}
   */
  static get mouseover() {
    return 'mouseover';
  }

  /**
   * Constant mouse leaves an element or its children
   * @return {string}
   */
  static get mouseout() {
    return 'mouseout';
  }
}
