/**
 * Created by bennun on 14/08/2017.
 * A class for building various css selectors
 */

import ElementCommon from './elementCommon';
import Sanitizer from './sanitizer';

const IGNORE_DYNAMIC_CLASSES = true;
const VALID_SELECTOR_REGEX = /^(?!(\d|--|-\d))\S+$/;

/** eslint "require-jsdoc": ["error", {
 "require": {
    "FunctionDeclaration": true,
    "MethodDefinition": true,
    "ClassDeclaration": true
 }
 }]*/
export default class ElementSelectorBuilder {
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
      let ret = '';

      if (VALID_SELECTOR_REGEX.test(str)) {
        ret = `.${str}`;
      }

      return ret;
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
    ret.nthPosition = ElementSelectorBuilder.elementNthPosition(element);

    if (!!element.attributes) {
      ret.attributes = {};

      for (let i = 0; i < element.attributes.length; i++) {
        // console.log(element.attributes);
        const key = element.attributes[i].name.toLowerCase();
        const value = Sanitizer.sanitize(element.attributes[i].value).trim();

        switch (key) {
          case 'id':
            if (VALID_SELECTOR_REGEX.test(value)) {
              ret[key] = value;
            }

            break;
          case 'class':
            ret[key] = value;

            break;

          default:
            ret.attributes[key] = value;
        }
      }
    }


    return ret;
  }

  /**
   * Get a valid selector string for an element
   * @param {Element} element - the DOM element to check
   * @return {string} - element's string selector
   */
  static buildSelectorString(element) {
    let selectors = ElementSelectorBuilder.buildSelectorsObject(element);

    let ret = '';

    if (!!selectors.id) {
      ret = `#${selectors.id}`;
    } else if (!!selectors.class) {
      if (IGNORE_DYNAMIC_CLASSES) {
        const staticClasses = ElementSelectorBuilder.filterDynamicClasses(selectors.class);

        // If all classes are dynamic, use tag name
        if (staticClasses.length === 0) {
          ret = `${selectors.tagName}:nth-child(${selectors.nthPosition})`;
        } else {
          ret = `${ElementSelectorBuilder.buildClassSelector(staticClasses)}:nth-child(${selectors.nthPosition})`;
        }
      } else {
        ret = `${ElementSelectorBuilder.buildClassSelector(selectors.class)}:nth-child(${selectors.nthPosition})`;
      }
    } else {
      ret = `${selectors.tagName}:nth-child(${selectors.nthPosition})`;
    }

    // console.log('for element (OUT): ', element, '\nselector: ', ret, '\nobject: ', selectors);
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
   * filter the dynamic classes
   * @param {string} classes - the current element classes
   * @return {string} - returns only static classes
   */
  static filterDynamicClasses(classes) {
    // get detected dynamic classes from body element
    const dynamicClasses = document.body.getAttribute('data-prism-dynamic-class') || '';

    const dynamicArray = dynamicClasses.split(/\s+/);
    const elementClassesArray = classes.split(/\s+/);

    // filter dynamic classes
    return elementClassesArray.filter((className) => {
      return !dynamicArray.includes(className);
    }).join(' ');
  }
}
