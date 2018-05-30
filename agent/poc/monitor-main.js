import SelectorGenerator from './selector-generator.js';
import AutData from './aut-data.js';
import TestData from './test-data.js';
import BdiConnector from './bdi-connector.js';

class PrismMonitor {

    constructor() {
        this.autData = new AutData();
        this.testData = new TestData();
        this.bdiConnector = new BdiConnector();
        this.dataSets = [
            {
                selectorGenerator: new SelectorGenerator(null),
                dataContextType: this.bdiConnector.contextTypes.DATA,
                errorContextType: this.bdiConnector.contextTypes.ERROR
/*            },
            {
                selectorGenerator: new SelectorGenerator({selectors: ['nthchild']}),
                dataContextType: this.bdiConnector.contextTypes.DATA_NTH,
                errorContextType: this.bdiConnector.contextTypes.ERROR_NTH*/
            }

        ];

        let captureMode = JSON.parse(localStorage.getItem('prism'));
        if (!captureMode || captureMode.state) {
            this.addClickEventListener();
        }
        this.sessionId = sessionStorage.getItem('prism_session');
        if (!this.sessionId || this.sessionId === undefined) {
            this.sessionId = this.generateSessionId();
            sessionStorage.setItem('prism_session', this.sessionId);
        }
    }

    addClickEventListener() {
        document.body.addEventListener('click', this.onElementClick, true);
    }

    removeClickEventListener() {
        document.body.removeEventListener('click', this.onElementClick, true);
    }

    onElementClick(event) {
        let info = {};
        try {
            let startedAt = new Date().getTime();
            let target = event.target;
            var targetOffset = {height: '', width: ''};
            targetOffset.height = (target.tagName.toLowerCase() === 'svg' ? target.getBBox().height : target.offsetHeight) || 0;
            targetOffset.width = (target.tagName.toLowerCase() === 'svg' ? target.getBBox().width : target.offsetWidth) || 0;
            info = {
                tag: target.tagName,
                element_size: {
                    'screenH': window.screen.availHeight,
                    'screenW': window.screen.availWidth,
                    'elementH': targetOffset.height,
                    'elementW': targetOffset.width
                },
                location: window.location,
                origin_background_color: window.getComputedStyle(target)['background-color'],
                sessionId: sessionStorage.getItem('prism_session')
            };
            prismMonitor.autData.appendAutData(info);
            let prismBdiIndexNameElement = document.querySelector('[data-prism-collection-name]');
            if (prismBdiIndexNameElement && prismBdiIndexNameElement.getAttribute('data-prism-collection-name') == 'test') {
                prismMonitor.testData.appendTestData(info);
            }
            prismMonitor.dataSets.forEach(function (dataSet) {
                let selector = dataSet.selectorGenerator.getSelector(target);
                info['selector'] = selector || 'Failed to fetch selector';
                info.client_time = new Date().getTime();
                info.client_timer = (new Date().getTime()) - startedAt;
                prismMonitor.bdiConnector.sendDataToBdi(info, selector ? dataSet.dataContextType : dataSet.errorContextType);
            });

        } catch (err) {
            prismMonitor.bdiConnector.sendDataToBdi(info, prismMonitor.bdiConnector.contextTypes.ERROR);
        }
    }

    generateSessionId() {
        let today = new Date();
        let sessionId = today.getUTCFullYear();
        if (today.getUTCMonth() < 10) {
            sessionId += '0' + today.getUTCMonth()
        } else {
            sessionId += '' + today.getUTCMonth()
        }
        if (today.getUTCDate() < 10) {
            sessionId += '0' + today.getUTCDate()
        } else {
            sessionId += '' + today.getUTCDate()
        }

        let arr = new Uint32Array(3);
        window.crypto.getRandomValues(arr);
        sessionId += '_' + arr.join('_');
        return sessionId;
    }
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        switch (request.type) {
            case 'prism-msg':
                switch (request.action) {
                    case 'set-debug-state':
                        let trackClicksState = {trackClicks: request.trackClicks};
                        localStorage.setItem('prism', JSON.stringify(trackClicksState));
                        if (!trackClicksState.trackClicks) {
                            prismMonitor.removeClickEventListener();
                        } else {
                            prismMonitor.addClickEventListener();
                        }
                        break;
                }
        }
        // sendResponse({data: request, success: true});
    });

