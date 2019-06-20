/**
 * Created by bennun on 01/08/2017.
 * This class builds a Prism-Element-Model which will be
 * sent to the data storage
 */


import IsElementClickable from './isElementClickable';
import ElementSelectorBuilder from './elementSelectorBuilder';
import ElementCommon from './elementCommon';

const IGNORE_SVG = true;

/** eslint "require-jsdoc": ["error", {
 "require": {
    "FunctionDeclaration": true,
    "MethodDefinition": true,
    "ClassDeclaration": true
 }
 }]*/
export default class PrismElementModel {
  /**
   * A constant
   * @return {string}
   */
  static get runManual() {
    return 'manual';
  }

  /**
   * A constant
   * @return {string}
   */
  static get runUser() {
    return 'user';
  }

  /**
   * A constant
   * @return {string}
   */
  static get runAutomation() {
    return 'automation';
  }

  /**
   * Creates a _model obj from a given DOM event
   * @param {Event} event - the event to build the model from
   */
  constructor(event) {
    let clientTime = Date.now();

    this._event = event;
    this._model = PrismElementModel.initEventModel({
      event: event,
      clientTime: clientTime,
    });

    // console.log(this._model, `took ${this._model['selector-generation-time'] - clientTime}ms`);
  }

  /**
   * Creates an element model & init it
   * @param {Event} event - the event object
   * @param {number} clientTime - the time the event occurred
   * @return {object | null} - the element model returned
   */
  static initEventModel({event, clientTime}) {
    let model;
    let parentSelector;
    let target = event.target || event.srcElement;
    let targetSelector;

    if (IGNORE_SVG) {
      target = ElementCommon.getFirstParentDifferentFromSVG(target);
    }

    targetSelector = ElementSelectorBuilder.buildSelectorsObject(target);

    targetSelector.uniqueSelector = ElementSelectorBuilder.buildPathSelector({element: target});

    if (targetSelector.uniqueSelector === null) {
      return null;
    }

    // targetSelector.isUnique = ElementSelectorBuilder.isSelectorUnique(targetSelector.uniqueSelector);

    // if target is not clickable, check for clickable parent
    if (!(targetSelector.isClickable = IsElementClickable.isClickable(target, event.type))) {
      let clickableParent = IsElementClickable.findClickableParent(target, event.type);

      if (!!clickableParent) {
        // let selectorString = ElementSelectorBuilder.buildSelectorString(clickableParent);
        parentSelector = ElementSelectorBuilder.buildSelectorsObject(clickableParent);
        parentSelector.uniqueSelector = ElementSelectorBuilder.buildPathSelector({element: clickableParent});
        // parentSelector.uniqueSelector = targetSelector.uniqueSelector.substring(0,
        //   targetSelector.uniqueSelector.indexOf(selectorString) + selectorString.length);

        // parentSelector.isUnique = ElementSelectorBuilder.isSelectorUnique(parentSelector.uniqueSelector);
      }
    }

    model = PrismElementModel.getEventModel({
      targetSelector: targetSelector,
      parentSelector: parentSelector,
      eventType: event.type,
      time: clientTime,
    });

    // start time
    // model['time'] = clientTime;
    // end time of selector generation
    // model['selector-generation-time'] = Date.now();

    return model;
  }

  /**
   * Returns the basic model for an event
   * @param {string} eventType - the event's type
   * @param {object} targetSelector - the target's selector object
   * @param {object} parentSelector - the clickable parent's selector object
   * @param {object} time - event's time
   * @return {object} - the json model
   */
  static getEventModel({eventType, targetSelector, parentSelector, time}) {
    // const docLocation = document.location;
    // const windowLocation = document.referrer;

    let ret = {
      'session-id': null,
      'time': time,
      // 'client-data': {
      //   'time': null,
      //   'browser': null,
      //   'geo-location': null,
      // },
      'url-data': {
        'protocol': null,
        'domain': null,
        'path': null,
        'params': null,
        'hash': null,
      },
      // 'aut-data': {
      //   'app-name': null,
      //   'tenant-id': null,
      //   'custom-fields': null,
      // },
      'context': {
        'tags': null,
      },
      'test-data': {
        'id': null,
        'mode': null,
        'name': null,
        'extra-details': null,
      },
      'selector-data': {
        'meaningful-selector': targetSelector.isClickable ? targetSelector.uniqueSelector : null,
        'event-type': eventType,
        'element-tag': targetSelector.tagName,
        'id': targetSelector.id,
        'class': targetSelector.class,
        'attr': targetSelector.attributes,
        'nth-position': targetSelector.nthPosition,
        'unique-selector': targetSelector.uniqueSelector,
        'is-clickable': targetSelector.isClickable,
      },
    };

    // if contained in a clickable parent
    if (!!parentSelector) {
      ret['selector-data']['meaningful-selector'] = parentSelector.uniqueSelector;

      ret['selector-data']['clickable-parent'] = {
        'element-tag': parentSelector.tagName,
        'id': parentSelector.id,
        'class': parentSelector.class,
        'attr': parentSelector.attributes,
        'nth-position': parentSelector.nthPosition,
        'unique-selector': parentSelector.uniqueSelector,
      };
    }

    return ret;
  }

  // /**
  //  * Apply the AUT data to the prism-model
  //  * @param {string} appName
  //  * @param {string} environment
  //  * @param {string} tenantID
  //  */
  // applyAUTData({appName, environment, tenantID}) {
  //   this._model['aut-data']['app-name'] = appName;
  //   this._model['aut-data']['tenant-id'] = tenantID;
  //   this._model['context']['environment'] = environment;
  // }

  /**
   * Apply the AUT's location data
   * @param {URL} location
   */
  applyLocation(location) {
    this._model['url-data'] = {
      'protocol': location.protocol,
      'domain': location.host,
      'path': location.pathname,
      'params': location.search,
      'hash': location.hash,
    };
  }

  /**
   * Apply the run mode to the prism-model
   * @param {string} mode
   */
  applyRunMode(mode) {
    this._model['test-data']['mode'] = mode;
  }

  /**
   * Apply the context tags to the prism-model
   * @param {Array} tags
   */
  applyTags(tags) {
    this._model['context']['tags'] = tags;
  }

  /**
   * Apply the session-id to the prism-model
   * @param {string} id
   */
  applySessionId(id) {
    this._model['session-id'] = id;
  }

  /**
   * Returns a string representing the model
   * @return {string} - the stringified model
   */
  convertModelToString() {
    return JSON.stringify(this._model);
  }
}


