/**
 * Created by bennun on 01/08/2017.
 */

/** eslint "require-jsdoc": ["error", {
 "require": {
    "FunctionDeclaration": true,
    "MethodDefinition": true,
    "ClassDeclaration": true
 }
 }]*/
export default class ElementCommon {
  /**
   * Check if element is of type tag
   * @param {Element} element - the DOM element to check
   * @param {string} tag - the element tag to check
   * @return {boolean | null} - is element of type tag
   */
  static isElementTypeOf({element, tag}) {
    let ret;

    if (element == null || element.tagName == null) {
      ret = null;
    } else {
      ret = element.tagName.toLowerCase() === tag.toLowerCase();
    }

    return ret;
  }

  /**
   * Check if element is of type SVG
   * @param {Element} element - the DOM element to check
   * @return {boolean} - is element of type SVG
   */
  static isElementOfTypeSVG(element) {
    return ElementCommon.isElementTypeOf({element: element, tag: 'svg'}) ||
      ElementCommon.isElementTypeOf({element: element, tag: 'line'}) ||
      ElementCommon.isElementTypeOf({element: element, tag: 'polyline'}) ||
      ElementCommon.isElementTypeOf({element: element, tag: 'rect'}) ||
      ElementCommon.isElementTypeOf({element: element, tag: 'circle'}) ||
      ElementCommon.isElementTypeOf({element: element, tag: 'ellipse'}) ||
      ElementCommon.isElementTypeOf({element: element, tag: 'polygon'}) ||
      ElementCommon.isElementTypeOf({element: element, tag: 'path'}) ||
      ElementCommon.isElementTypeOf({element: element, tag: 'use'});
  }

  /**
   * Check if element is of type SVG
   * @param {Element} element - the DOM element to check
   * @param {string} stopElement - the tag element to stop the search at
   * @return {Array} - the array of parents
   */
  static getParentDomElements({element, stopElement = 'body'}) {
    let ret = [];

    for (let targetParent = element.parentElement; !!targetParent &&
    !ElementCommon.isElementTypeOf({element: targetParent, tag: stopElement});
         targetParent = targetParent.parentElement) {
      if (!!targetParent && !!targetParent.tagName) {
        ret.push(targetParent);
      }
    }

    return ret;
  }

  /**
   * Get the first element in the DOM path that is different from SVG
   * @param {Element} element - the DOM element to start the check from
   * @return {Element} - the first element not of type SVG
   */
  static getFirstParentDifferentFromSVG(element) {
    let ret;


    if (!ElementCommon.isElementOfTypeSVG(element)) { // if current element
      ret = element;
    } else { // if one of parents
      let parents = ElementCommon.getParentDomElements({element: element});

      for (let i = 0; i < parents.length; i++) {
        // is element clickable
        if (!ElementCommon.isElementOfTypeSVG(parents[i])) {
          ret = parents[i];
          break;
        }
      }
    }

    return ret;
  }
}


