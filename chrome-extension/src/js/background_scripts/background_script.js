/**
 * Created by bennun on 19/07/2017.
 */

console.log('Hello from background script');

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch (request.message) {
        case 'startRecording':
            // recording icon to indicate we are in a recording session
            // need to set per app env using tabId
            chrome.browserAction.setIcon({
                path: 'assets/prism_logo_rec_16.png',
            });
            chrome.browserAction.setTitle({
                title: 'Visual Test Coverage: recorded session',
            });
            // send to agent to add recording name
            break;

        case 'stopRecording':
            // return to default chrome extension icon
            // need to set per app env using tabId
            chrome.browserAction.setIcon({
                path: 'assets/prism_logo_16.png',
            });
            chrome.browserAction.setTitle({
                title: 'Visual Test Coverage',
            });
            // send to agent to remove recording name
            break;

        case 'getRecordingNames':
            // taken from db
            let recordingNamesList = ['session1', 'session2'];
            sendResponse(recordingNamesList);
            break;

        default:
    }
});


