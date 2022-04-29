
// var global_subscription_handler= null;
var global_ServiceWorker= null;

//-------------------------------------------------------------------------------------------------

// https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid
//
function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}
  
// console.log(uuidv4());

//-------------------------------------------------------------------------------------------------
// MsgEnv

console.log('MsgEnv: new BroadcastChannel()');
const msgenv_BroadcastChannel = new BroadcastChannel('');

function IPSME_MsgEnv_subscribe(handler) {
    window.global_subscription_handler= handler;
}

function IPSME_MsgEnv_unsubscribe(handler) {
    window.global_subscription_handler= null;
}

// https://stackoverflow.com/questions/23051416/uncaught-invalidstateerror-failed-to-execute-send-on-websocket-still-in-co
//
let connection_resolvers= [];
let checkConnection = () => {
    return new Promise((resolve, reject) => {
        if (global_ServiceWorker) {
            if (global_ServiceWorker.state === "activated") {
                resolve();
                return;
            }
        }

        connection_resolvers.push({resolve, reject});
    });
}

msgenv_BroadcastChannel.onmessage = event => {
    msg= event.data;
    console.log('MsgEnv: onmessage: ['+ msg +']');

	// console.log('msgenv_BroadcastChannel.onmessage: ['+ event.data +']'); 
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null
    if (window.global_subscription_handler !== null)
        window.global_subscription_handler(msg);
}

async function async_publish(str_msg) {
    await checkConnection();

    console.log('MsgEnv: async_publish ['+ str_msg +']');
    msgenv_BroadcastChannel.postMessage(str_msg);
}

function IPSME_MsgEnv_publish(str_msg) {
	async_publish(str_msg);
}

//-------------------------------------------------------------------------------------------------
// js-reflector-ws-client (ServiceWorker)

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
        //registration.update();

        // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorker

        if (registration.installing) {
            global_ServiceWorker= registration.installing;
        }
        else if (registration.waiting) {
            global_ServiceWorker= registration.waiting;
        }
        else if (registration.active) {
            global_ServiceWorker= registration.active;
        }

        if (global_ServiceWorker) 
        {
            // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorker/state
            // ServiceWorker.state;
            // "installing" - the install event has fired, but not yet complete
            // "installed"  - install complete
            // "activating" - the activate event has fired, but not yet complete
            // "activated"  - fully active
            // "redundant"  - discarded. Either failed install, or it's been
            //                replaced by a newer version        

            global_ServiceWorker.onstatechange= onstatechange= function(event) {
                if (global_ServiceWorker.state === "activated") {
                    connection_resolvers.forEach(r => r.resolve());
                }
            }
        }

        registration.onupdatefound= function(event) 
        {
            // If updatefound is fired, it means that there's
            // a new service worker being installed.
            console.log('REG: A new service worker is being installed:', registration.installing);
        };

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

//-------------------------------------------------------------------------------------------------
