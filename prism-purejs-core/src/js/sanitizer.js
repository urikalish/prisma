/**
 * Created by bennun on 08/08/2017.
 */

/** eslint "require-jsdoc": ["error", {
 "require": {
    "FunctionDeclaration": true,
    "MethodDefinition": true,
    "ClassDeclaration": true
 }
 }]*/
export default class Sanitizer {
  /**
   * Constant
   * @return {RegExp}
   */
  static get regex() {
    return /[!"#$%&'()*+,.\/|\\;:<=>?@\[\]^`{}~]/;
  }

  /**
   * Sanitize a given string
   * @param {string} text - the text to be sanitized
   * @return {string} The sanitized string
   */
  static sanitize(text) {
    return text.split('').map((char) => {
      if (Sanitizer.regex.test(char)) {
        return `\\${char}`;
      } else {
        return char;
      }
    }).join('');
  }
}
