/**
 * Content script - for injecting a script into the AUT's scope.
 * This script also makes sure the injected script is the 1st to run.
 */
const injectedFileURL = chrome.extension.getURL('injected-to-aut-scope.bundle.js');
let injectedScriptElement = document.createElement('script');

injectedScriptElement.type = 'text/javascript';
injectedScriptElement.async = false;

// Get the injected script as code
fetch(injectedFileURL, {headers: {contentType: 'application/javascript'}})
  .then((res) => {
    return res.text();
  })
  .then((file) => {
    injectedScriptElement.innerHTML = file;
  });

// Wait for the <HEAD> tag to be created & inject the script as the 1st
// child
document.onreadystatechange = function() {
  if (document.readyState === 'interactive') {
    if (document.head != null) {
      if (document.head.firstChild != null) {
        document.head.insertBefore(injectedScriptElement, document.head.firstChild);
      } else {
        document.head.appendChild(injectedScriptElement);
      }
    }
  }
};
