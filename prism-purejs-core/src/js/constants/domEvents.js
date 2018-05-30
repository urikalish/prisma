/**
 * Created by bennun on 21/08/2017.
 * Constants for DOM events, from W3
 * https://www.w3.org/TR/DOM-Level-3-Events/#event-types
 */

/** eslint "require-jsdoc": ["error", {
 "require": {
    "FunctionDeclaration": true,
    "MethodDefinition": true,
    "ClassDeclaration": true
 }
 }]*/
export default class DomEvents {
  /**
   * Constant for When an element loses the focus
   * @return {string}
   */
  static get blur() {
    return 'blur';
  }

  /**
   * Constant for When a form field value changes
   * @return {string}
   */
  static get change() {
    return 'change';
  }

  /**
   * Constant for When an element receives the focus
   * @return {string}
   */
  static get focus() {
    return 'focus';
  }

  /**
   * Constant for When something is scrolled
   * @return {string}
   */
  static get scroll() {
    return 'scroll';
  }

  /**
   * Constant for When text is copied
   * @return {string}
   */
  static get copy() {
    return 'copy';
  }

  /**
   * Constant for When text is pasted
   * @return {string}
   */
  static get paste() {
    return 'paste';
  }

  /**
   * Constant for When text is cut
   * @return {string}
   */
  static get cut() {
    return 'cut';
  }

  /**
   * Constant for When the browser encounters a JavaScript error or a missing asset file
   * @return {string}
   */
  static get error() {
    return 'error';
  }

  /**
   * Constant As focus, but bubbles
   * @return {string}
   */
  static get focusin() {
    return 'focusin';
  }

  /**
   * Constant As blur, but bubbles
   * @return {string}
   */
  static get focusout() {
    return 'focusout';
  }

  /**
   * Constant for When the hash value of the location changes
   * @return {string}
   */
  static get hashchange() {
    return 'hashchange';
  }

  /**
   * Constant for When an asset (HTML page, image, CSS or JS file) is loaded
   * @return {string}
   */
  static get load() {
    return 'load';
  }

  /**
   * Constant for When the user resets a form
   * @return {string}
   */
  static get reset() {
    return 'reset';
  }

  /**
   * Constant for When the window is resized
   * @return {string}
   */
  static get resize() {
    return 'resize';
  }

  /**
   * Constant for When the user selects text
   * @return {string}
   */
  static get select() {
    return 'select';
  }

  /**
   * Constant for When the user submits a form
   * @return {string}
   */
  static get submit() {
    return 'submit';
  }

  /**
   * Constant for When the user navigates away from the page
   * @return {string}
   */
  static get unload() {
    return 'unload';
  }
}
