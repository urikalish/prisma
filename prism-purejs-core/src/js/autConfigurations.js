/**
 * Created by bennun on 15/08/2017.
 * A class for enriching the AUT data & behaviour
 */

/** eslint "require-jsdoc": ["error", {
 "require": {
    "FunctionDeclaration": true,
    "MethodDefinition": true,
    "ClassDeclaration": true
 }
 }]*/
export default class AUTConfigurations {
  /**
   * Creates a configuration for the AUT
   *
   * @param {string} appName
   * @param {string} environment
   * @param {string} product
   * @param {string} productURL
   * @param {string} tenantID
   * @param {string} ctClient
   * @param {string} ctSecret
   */
  constructor({appName, environment, product, productURL, tenantID, ctURL, ctClient, ctSecret}) {
    this._appName = appName;
    this._environment = environment;
    this._product = product;
    this._productURL = productURL;
    this._tenantID = tenantID;

    this._ctURL = ctURL;
    this._ctClient = ctClient;
    this._ctSecret = ctSecret;

    this._autClickableClasses = null;
    this._autMeaninglessClasses = null;
  }

  /**
   * Set AUT specific clickable elements
   * @param {Array} selectors
   */
  set clickableClasses(selectors) {
    this._autClickableClasses = selectors;
  }

  /**
   * Get the AUT's specifig clickable elements
   * @return {Array}
   */
  get clickableClasses() {
    return this._autClickableClasses;
  }

  /**
   * Set AUT specific ignored classes (like hover classes, state classes & other dynamic classes)
   * @param {Array} classes
   */
  set meaninglessClasses(classes) {
    this._autMeaninglessClasses = classes;
  }

  /**
   * Returns the AUT's specific ignored classes
   * @return {Array}
   */
  get meaninglessClasses() {
    return this._autMeaninglessClasses;
  }

  /**
   * Returns the AUT's configurations
   * @return {Object}
   */
  get autData() {
    return {
      appName: this._appName,
      environment: this._environment,
      product: this._product,
      productURL: this._productURL,
      tenantID: this._tenantID,
      clickableClasses: this.clickableClasses,
      meaninglessClasses: this.meaninglessClasses,
      trackedEvents: this.trackedEvents,
    };
  }

  /**
   * Set the AUT's tracked events
   * @param {Array} events
   */
  set trackedEvents(events) {
    this._trackedEvents = events;
  }

  /**
   * Get the AUT's tracked events
   * @return {Array}
   */
  get trackedEvents() {
    return this._trackedEvents;
  }

  /**
   * Returns the AUT's credentials
   * @return {Object}
   */
  get agentCredentials() {
    return {
      ctURL: this._ctURL,
      ctClient: this._ctClient,
      ctSecret: this._ctSecret,
    };
  }
}


