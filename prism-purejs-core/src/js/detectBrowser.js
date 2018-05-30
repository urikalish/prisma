/**
 * Created by bennun on 25/07/2017.
 * A class for browser detection
 */

/** eslint "require-jsdoc": ["error", {
 "require": {
    "FunctionDeclaration": true,
    "MethodDefinition": true,
    "ClassDeclaration": true
 }
 }]*/
export default class DetectBrowser {
  /**
   * Constant
   * @return {string}
   */
  static get internetExplorer() {
    return 'IE';
  }

  /**
   * Constant
   * @return {string}
   */
  static get edge() {
    return 'Edge';
  }

  /**
   * Constant
   * @return {string}
   */
  static get chrome() {
    return 'Chrome';
  }

  /**
   * Constant
   * @return {string}
   */
  static get safari() {
    return 'Safari';
  }

  /**
   * Constant
   * @return {string}
   */
  static get firefox() {
    return 'Firefox';
  }

  /**
   * Constant
   * @return {string}
   */
  static get opera() {
    return 'Opera';
  }

  /**
   * Constant
   * @return {string}
   */
  static get unknown() {
    return 'Unknown';
  }

  /**
   * Detected the client's browser, version & desktop / mobile
   * @return {Object} The current browser
   */
  static clientBrowser() {
    let ret = {
      browser: null,
      version: null,
      isMobile: null,
    };

    if (!!navigator) {
      let tempOutput;

      let userAgentString = navigator.userAgent.toLowerCase();
      let ieRegex = /MSIE\s+(\d+(\.\d+)*)/i;
      let chromeRegex = /Chrome\/(\d+(\.\d+)*)/i;
      let firefoxRegex = /Firefox\/(\d+(\.\d+)*)/i;
      let operaRegex = /Opera\/(\d+(\.\d+)*)/i;
      let safariRegex = /Safari\/(\d+(\.\d+)*)/i;

      if (userAgentString.indexOf('Trident/') > 0) { // Explorer
        if ((tempOutput = ieRegex.exec(userAgentString)) !== null) {
          ret.browser = DetectBrowser.internetExplorer;
        } else {
          ret.browser = DetectBrowser.edge;
        }
      } else if ((tempOutput = chromeRegex.exec(userAgentString)) !== null) { // Chrome
        ret.browser = DetectBrowser.chrome;
      } else if ((tempOutput = firefoxRegex.exec(userAgentString)) !== null) { // Firefox
        ret.browser = DetectBrowser.firefox;
      } else if ((tempOutput = operaRegex.exec(userAgentString)) !== null) { // Opera
        ret.browser = DetectBrowser.opera;
      } else if ((tempOutput = safariRegex.exec(userAgentString)) !== null) { // Safari
        ret.browser = DetectBrowser.safari;
      } else {
        ret.browser = DetectBrowser.unknown;
      }

      ret.version = tempOutput !== null ? tempOutput[1] : null; // Version
      ret.isMobile = userAgentString.indexOf('mobi') >= 0; // Detect mobile device
    }

    return ret;
  }
}
