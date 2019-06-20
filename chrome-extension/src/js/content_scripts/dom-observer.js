/** eslint "require-jsdoc": ["error", {
 "require": {
    "FunctionDeclaration": true,
    "MethodDefinition": true,
    "ClassDeclaration": true
 }
 }]*/
export default class DomObserver {
  /**
   * Init the observer
   * @param {Element} rootElement
   * @param {Function} callback
   * @param {Object} config
   */
  constructor({rootElement, callback, config = {}}) {
    if (!(rootElement instanceof Element)) {
      throw new Error('DOMObserver:: {rootElement} is not a DOM element!');
    } else if (typeof callback !== 'function') {
      throw new Error('DOMObserver:: {callback} is not a function!');
    }

    this._domElement = rootElement;
    this._config = Object.assign({}, defaultConfig, config);
    this._callback = callback;

    this._observer = new MutationObserver((mutations) => mutations.forEach((mutation) => this._callback(mutation)));
  }

  /**
   * Starts observing the rootElement for changes
   */
  observe() {
    this._observer.observe(this._domElement, this._config);
  }

  /**
   * Stops observing the rootElement for changes
   */
  stop() {
    this._observer.disconnect();
  }
}

/**
 * This code detects if an element/attribute was added to the DOM & sends a message
 */
const defaultConfig = {
  attributes: false,
  characterData: false,
  childList: true,
  subtree: true,
  attributeOldValue: false,
  characterDataOldValue: false,
};
