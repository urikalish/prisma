let port;

// Receive message from Octane and send it to the background page
if (!!chrome && !!chrome.runtime) {
    window.addEventListener('message', function(request /* , sender*/) {
        if (request.source === window) {
            if (request.data && (request.data.source === 'octane' || request.data.source === 'alm')) {
                let requestType = request.data.type;
                switch (requestType) {
                    case 'manualRunStarted':

                        // Send message to Background for start recording
                        console.log('Start recording message:',
                            request.data.context);

                        chrome.runtime.sendMessage({
                            message: 'startRecording',
                            context: request.data.context,
                        });

                        window.postMessage({
                            source: 'prism',
                            type: 'manualRunStartedAck',
                            context: request.data.context,
                        }, '*');

                        break;

                    case 'manualRunStopped':

                        // Send message to Background for stop recording
                        console.log('Stop recording message');
                        chrome.runtime.sendMessage({message: 'stopRecording'});

                        break;

                    case 'showVisualCoverage':

                        // Send message to Background for showing coverage
                        console.log('Show Coverage message:', request.data.context);

                        chrome.runtime.sendMessage({
                            message: 'showCoverage',
                            context: request.data.context,
                        });

                        break;
                }
            }
        }
    });

    const keepAlive = () => {
        port = chrome.runtime.connect({name: 'prism-content-script'});
        port.onMessage.addListener(() => {
            // console.log('connected');

            // Add onDisconnected only when a connections was made to BG
            port.onDisconnect.addListener(() => {
                window.location.reload();
            });
        });
    };

    keepAlive();
}
