
const msgenv_BroadcastChannel = new BroadcastChannel('');

var global_subscription_handler= null;

function IPSME_MsgEnv_subscribe(handler) {
    window.global_subscription_handler= handler;
}

function IPSME_MsgEnv_unsubscribe(handler) {
    window.global_subscription_handler= null;
}

msgenv_BroadcastChannel.onmessage = event => {
	// console.log('CLIENT: BroadcastChannel msg ['+ event.data +']'); 
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null
    if (global_subscription_handler !== null)
        window.global_subscription_handler(event.data);
}

function IPSME_MsgEnv_publish(str_msg) {
    msgenv_BroadcastChannel.postMessage(str_msg);
}

//-------------------------------------------------------------------------------------------------

// https://web.dev/service-worker-lifecycle/
// You can detect if a client is controlled via navigator.serviceWorker.controller which will be null or a service worker instance

// Waiting:
// Even if you only have one tab open to the demo, refreshing the page isn't enough to let the new version take over. 
// This is due to how browser navigations work. When you navigate, the current page doesn't go away until the response headers 
// have been received, and even then the current page may stay if the response has a Content-Disposition header. 
// Because of this overlap, the current service worker is always controlling a client during a refresh.
// To get the update, close or navigate away from all tabs using the current service worker. 

if ('serviceWorker' in navigator) 
{
    navigator.serviceWorker.register('reflector-ws-client.js').then(function(registration) 
    {
        // manually update service worker
        // registration.update();

        registration.installing; // the installing worker, or undefined
        registration.waiting; // the waiting worker, or undefined
        registration.active; // the active worker, or undefined

        registration.addEventListener('updatefound', function() {
            // If updatefound is fired, it means that there's
            // a new service worker being installed.
            var installingWorker = registration.installing;
            console.log('REG: A new service worker is being installed:', installingWorker);

            // You can listen for changes to the installing service worker's
            // state via installingWorker.onstatechange

            // https://web.dev/service-worker-lifecycle/
            registration.installing.state;
            // "installing" - the install event has fired, but not yet complete
            // "installed"  - install complete
            // "activating" - the activate event has fired, but not yet complete
            // "activated"  - fully active
            // "redundant"  - discarded. Either failed install, or it's been
            //                replaced by a newer version        

            registration.installing.addEventListener('statechange', () => {
                // newWorker.state has changed
            });
        });

    })
    .catch(function(error) {
        console.log('REG: Service worker registration failed:', error);
    });

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      // This fires when the service worker controlling this page
      // changes, eg a new worker has skipped waiting and become
      // the new active worker.
    });
} 
else {
    console.log('REG: Service workers are not supported.');
}
