/**
 * Created by bennun on 10/08/2017.
 */

// import {prismStorageManager} from './../core-strings.json';

/** eslint "require-jsdoc": ["error", {
 "require": {
    "FunctionDeclaration": true,
    "MethodDefinition": true,
    "ClassDeclaration": true
 }
 }]*/
export default class PrismStorageManager {
  /**
   * Saves data in localStorage
   * @param {string} key
   * @param {*} data
   */
  static save(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  /**
   * Loads data from localStorage
   * @param {string} key
   * @return {*}
   */
  static load(key) {
    return JSON.parse(localStorage.getItem(key));
  }

  /**
   * Deletes data from localStorage
   * @param {string} key
   */
  static clear(key) {
    localStorage.removeItem(key);
  }
}
