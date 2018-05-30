import { Injectable } from '@angular/core';

declare var chrome;

@Injectable()
export class MessagingService {

  constructor() { }

  /*
   Sends a single message to event listeners within your extension/app
    */
  sendMessageToExt(message: any, responseCallback: Function) {
    if (chrome.runtime) {
      chrome.runtime.sendMessage(message, responseCallback);
    }
  }

  /*
    Sends a single message to the content script(s) in the specified tab
   */
  sendMessageToContentId(tabID: Number, message: any, responseCallback: Function) {
    if (chrome.tabs) {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabID, message, responseCallback);
      });
    }
  }

  /*
    Listener to messages sent by either an extension process (runtime.sendMessage) or a content script (tabs.sendMessage)
   */
  onMessageResponse(requestKey: string, requestValue: string, response: any) {
    if (chrome.runtime) {
      chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
          console.log(sender.tab ?
            "recieve message from :" + sender.tab.url :
            "recieve message from the extension");
          if (request[requestKey] == requestValue)
            sendResponse(response);
        });
    }
  }

}
