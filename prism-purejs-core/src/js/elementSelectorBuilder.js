/**
 * Created by bennun on 14/08/2017.
 * A class for building various css selectors
 */

import ElementCommon from './elementCommon';
import Sanitizer from './sanitizer';

/** eslint "require-jsdoc": ["error", {
 "require": {
    "FunctionDeclaration": true,
    "MethodDefinition": true,
    "ClassDeclaration": true
 }
 }]*/
export default class ElementSelectorBuilder {
  /**
   * Check if element is unique in the document (current page)
   * @param {string} stringSelector - the element's string selector
   * @return {boolean} - is element unique
   */
  static isSelectorUnique(stringSelector) {
    let ret;

    ret = document.body.querySelectorAll(stringSelector.replace(/:nth-child\(\d+\)/g, '')).length === 1;

    return ret;
  }

  /**
   * build CSS attributes selector
   * @param {object} attributes - the DOM element to check
   * @return {string} - CSS selector
   */
  static buildAttributesSelector(attributes) {
    let ret = '';

    for (let attr in attributes) {
      if (attributes.hasOwnProperty(attr)) {
        ret += `[${attr}${!!attributes[attr] ? '="' + attributes[attr] + '"' : ''}]`;
      }
    }

    return ret;
  }

  /**
   * build CSS class selector
   * @param {string} classes - a space separated string with all classes
   * @return {string} - CSS selector
   */
  static buildClassSelector(classes) {
    let ret = '';

    ret += `${classes.split(/\s+/).map((str) => {
      return str.trim().length !== 0 ? `.${str}` : '';
    }).join('')}`;

    return ret;
  }

  /**
   * Get all possible selectors for a given element
   * @param {Element} element - the DOM element to check
   * @return {object} - element's selectors
   */
  static buildSelectorsObject(element) {
    let ret = {};

    ret.tagName = element.tagName.toLowerCase();

    if (!!element.attributes) {
      ret.attributes = {};

      for (let i = 0; i < element.attributes.length; i++) {
        let key = element.attributes[i].name;
        let value = Sanitizer.sanitize(element.attributes[i].value);
        // let value = element.attributes[i].value;
        switch (key.toLowerCase()) {
          case 'id':
          case 'class':
            ret[key] = value;
            break;

          default:
            ret.attributes[key] = value;
        }
      }
    }

    ret.nthPosition = ElementSelectorBuilder.elementNthPosition(element);

    // if (!!element.innerText) {
    //   ret.innerText = element.innerText.slice(0, 255);
    // }

    return ret;
  }

  /**
   * Get a valid selector string for an element
   * @param {Element} element - the DOM element to check
   * @return {string} - element's string selector
   */
  static buildSelectorString(element) {
    let selectors = ElementSelectorBuilder.buildSelectorsObject(element);
    let ret = selectors.tagName;

    if (!!selectors.id) {
      ret += `#${selectors.id}`;
    } else if (!!selectors.class) {
      ret += `${ElementSelectorBuilder.buildClassSelector(selectors.class)}:nth-child(${selectors.nthPosition})`;
      // } else if (!!selectors.attributes) {
      //   ret += ElementSelectorBuilder.buildAttributesSelector(
      // selectors.attributes) +
      //     `:nth-child(${selectors.nthPosition})`;
    } else {
      ret += `:nth-child(${selectors.nthPosition})`;
    }

    return ret;
  }

  /**
   * Build the path selector for an element - stops when unique
   * @param {Element} element - the DOM element to start the check from
   * @param {number} depth - path depth
   * @return {string} - the first element not of type SVG
   */
  static buildPathSelector({element, depth = -1}) {
    let ret = '';

    // if the target element is not unique
    if (!element.id) {
      let parents = ElementCommon.getParentDomElements({element: element});

      // determine valid depth
      if (depth < 0) {
        depth = parents.length;
      } else {
        depth = depth > parents.length ? parents.length : depth;
      }

      // build parents path
      for (let i = 0; i < depth; i++) {
        // is element clickable
        ret = `${ElementSelectorBuilder.buildSelectorString(parents[i])} > ${ret}`;

        if (!!parents[i].id) {
          break;
        }
      }
    }

    // add target's selector
    ret += ElementSelectorBuilder.buildSelectorString(element);

    return ret;
  }

  /**
   * Check if element is unique in the document (current page)
   * @param {Element} element - the element to check
   * @return {number} - the element's position in its parent
   */
  static elementNthPosition(element) {
    let position = 1;
    let sibling = element;

    while ((sibling = sibling.previousElementSibling) !== null) {
      position++;
    }

    return position;
  }

  /**
   * Check if element is unique in the document (current page)
   * @param {object} selectorsObject - the element's selectors
   * @return {boolean} - is element unique
   */
  static isElementUnique(selectorsObject) {
    let ret;
    // let selectors = ElementCommon.buildSelectorsObject(element);

    if (!!selectorsObject.id) { // check by id
      ret = document.body.querySelectorAll(
          `[id="${selectorsObject.id}"]`).length === 1;
    } else if (!!selectorsObject.class) { // check by classes
      ret = document.body.querySelectorAll(
          `[class="${selectorsObject.class}"]`).length === 1;
    } else if (!!selectorsObject.attributes) { // check by attributes
      ret = document.body.querySelectorAll(selectorsObject.tagName +
          ElementSelectorBuilder.buildAttributesSelector(selectorsObject.attributes)).length === 1;
    } else { // by tag only
      ret = document.body.querySelectorAll(selectorsObject.tagName).length === 1;
    }

    return ret;
  }
}
