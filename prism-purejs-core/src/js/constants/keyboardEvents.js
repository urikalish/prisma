/**
 * Created by bennun on 21/08/2017.
 * Constants for Keyboard events, from W3
 * https://www.w3.org/TR/DOM-Level-3-Events/#event-types
 */

/** eslint "require-jsdoc": ["error", {
 "require": {
    "FunctionDeclaration": true,
    "MethodDefinition": true,
    "ClassDeclaration": true
 }
 }]*/
export default class KeyboardEvents {
  /**
   * Constant for When the user depresses a key
   * @return {string}
   */
  static get keydown() {
    return 'keydown';
  }

  /**
   * Constant for When a keystroke leads to a character being added to an HTML element
   * @return {string}
   */
  static get keypress() {
    return 'keypress';
  }

  /**
   * Constant for When the user releases a key
   * @return {string}
   */
  static get keyup() {
    return 'keyup';
  }
}
