/**
 * Created by bennun on 21/08/2017.
 */

import {DomEventHandler, PrismEvents, PrismEventsHandler, Sanitizer} from "./index";

import tmpStyle from "./controller.css";
import template from "./controller.html";

export default class PrismController {
  constructor() {
    this._capturedEvents = null;
    this._prevStyle = null;
    this._selectedTrackedEvents = null;
    
    this._onlyClickable = false;
    this._onlyUnique = false;
    this._ignoreParent = false;
    
    this._clickableBtn = null;
    this._uniqueBtn = null;
    this._parentBtn = null;
    this._stepElement = null;
    this._appNameElement = null;
    this._checkboxTemplate = null;
    
    this._step = 0;
    
    PrismEventsHandler.onEvent({
      event: PrismEvents.respondCaputuredEvents,
      callback: (event) => {
        // console.log(event);
        this._capturedEvents = event.data;
        
        if (!event.data || event.data.length === 0) {
          return;
        }
        
        this._step = event.data.length;
        
        this._capturedEvents.sort((m1, m2) => {
          return m2._model['selector-data']['unique-selector'].length - m1._model['selector-data']['unique-selector'].length;
        });
        
        this.updateAUTView();
      },
    });
    
    // When agent's loaded to page, fire events
    PrismEventsHandler.onEvent({
      event: PrismEvents.notifyAgentLoaded,
      callback: () => {
        PrismEventsHandler.fireEvent({
          event: PrismEvents.notifyExtensionLoaded,
        });
        
        PrismEventsHandler.fireEvent({
          event: PrismEvents.requestAUTData
        })
      },
    });
    
    PrismEventsHandler.onEvent({
      event: PrismEvents.respondAUTData,
      callback: (event) => {
        this._autData = event.data;
        this.updateControllerView();
      }
    });
    
    // when extension loaded, fire event
    PrismEventsHandler.fireEvent({
      event: PrismEvents.notifyExtensionLoaded,
    });
    
    setInterval(() => {
      PrismEventsHandler.fireEvent({event: PrismEvents.requestCaputuredEvents});
    }, 1000);
  }
  
  createControllerView() {
    let templateElement = document.createElement('section');
    
    templateElement.id = 'prism:container';
    templateElement.innerHTML = template;
    
    document.body.appendChild(templateElement);
    this.addStyleToPage(tmpStyle);
    
    this._clickableBtn = document.getElementById('prism:clickable-toggle');
    this._uniqueBtn = document.getElementById('prism:unique-toggle');
    this._parentBtn = document.getElementById('prism:parent-toggle');
    this._stepElement = document.getElementById('prism:step-counter');
    this._appNameElement = document.getElementById('prism:app-name');
    
    DomEventHandler.bindEvent({
      event: 'click',
      element: this._uniqueBtn,
      callback: (event) => {
        this._onlyUnique = !this._onlyUnique;
        
        if (this._onlyUnique) {
          this._uniqueBtn.className = 'on';
        } else {
          this._uniqueBtn.className = '';
        }
        
        PrismEventsHandler.fireEvent({event: PrismEvents.requestCaputuredEvents});
      },
    });
    
    DomEventHandler.bindEvent({
      event: 'click',
      element: this._clickableBtn,
      callback: (event) => {
        this._onlyClickable = !this._onlyClickable;
        
        if (this._onlyClickable) {
          this._clickableBtn.className = 'on';
        } else {
          this._clickableBtn.className = '';
        }
        
        PrismEventsHandler.fireEvent({event: PrismEvents.requestCaputuredEvents});
      },
    });
    
    DomEventHandler.bindEvent({
      event: 'click',
      element: this._parentBtn,
      callback: (event) => {
        this._ignoreParent = !this._ignoreParent;
        
        if (this._ignoreParent) {
          this._parentBtn.className = 'on';
        } else {
          this._parentBtn.className = '';
        }
        
        PrismEventsHandler.fireEvent({event: PrismEvents.requestCaputuredEvents});
      },
    });
  }
  
  updateControllerView() {
    this._appNameElement.innerText = this._autData.appName;
    
    //TODO: create events selection
  }
  
  updateAUTView() {
    let style = '';
    
    for (let i = 0; i < this._capturedEvents.length; i++) {
      let selector = this.createCSSSelector(this._capturedEvents[i]._model);
      let regex = new RegExp(`, ${Sanitizer.sanitize(selector)}[,\\{]`);
      
      if (this._ignoreParent && style.indexOf(selector) === -1) {
        style += selector;
        style += ', ';
      } else if (!this._ignoreParent && style.search(new RegExp(regex)) === -1) {
        style += selector;
        style += ', ';
      }
      // console.log(style.search(regex), regex);
    }
    
    style = style.replace(/,(\s+,)+/g, ', ');
    style = style.replace(/,\s+$/, '');
    style = style.replace(/^,\s+/, '');
    
    // for (let i = 0; i < aut.ignoreClasses.length; i++) {
    //   style = style.replace(new RegExp(`\\.${aut.ignoreClasses[i]}`, 'g'), '');
    // }
    
    if (!this._onlyUnique) {
      style = style.replace(/:nth-child\(\d+\)/g, '');
    }
    
    style += `{ background: rgba(0, 128, 0, 0.4) !important;  }`;
    
    // console.log(style);
    
    if (!!this._prevStyle) {
      document.head.removeChild(this._prevStyle);
    }
    
    this._stepElement.innerText = this._step;
    
    this._prevStyle = this.addStyleToPage(style);
  }
  
  createCSSSelector(prismModel) {
    let selectorData = prismModel['selector-data'];
    
    if (this._onlyClickable && !selectorData['is-clickable'] &&
      !(selectorData = selectorData['clickable-parent'])) {
      return '';
    }
    
    let selectorString = selectorData['unique-selector'];
    
    return selectorString;
  }
  
  addStyleToPage(cssString) {
    let styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    
    styleSheet.innerText = cssString;
    document.head.appendChild(styleSheet);
    
    return styleSheet;
  }
}
