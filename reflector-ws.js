
var global_ServiceWorker= null;

//-------------------------------------------------------------------------------------------------
// REG: js-reflector-ws-client (ServiceWorker)

// https://web.dev/service-worker-lifecycle/
// You can detect if a client is controlled via navigator.serviceWorker.controller which will be null or a service worker instance

// Waiting:
// Even if you only have one tab open to the demo, refreshing the page isn't enough to let the new version take over. 
// This is due to how browser navigations work. When you navigate, the current page doesn't go away until the response headers 
// have been received, and even then the current page may stay if the response has a Content-Disposition header. 
// Because of this overlap, the current service worker is always controlling a client during a refresh.
// To get the update, close or navigate away from all tabs using the current service worker. 

function register()
{
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
                // if we are here, the onstatechange handler below never fires.
                //
    //           connection_resolvers.forEach(r => r.resolve());
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

                global_ServiceWorker.onstatechange= function(event) {
                    // if (global_ServiceWorker.state === "activated") {
                    //     connection_resolvers.forEach(r => r.resolve());
                    // }
                };
            }

            registration.onupdatefound= function(event) {
                // If updatefound is fired, it means that there's
                // a new service worker being installed.
                console.log('REG: A new service worker is being installed:', registration.installing);
            };

        })
        .catch(function(error) {
            console.log('REG: Service worker registration failed:', error);
        });

        navigator.serviceWorker.oncontrollerchange= function(event) {
        // This fires when the service worker controlling this page
        // changes, eg a new worker has skipped waiting and become
        // the new active worker.
        };
    } 
    
    else console.log('REG: Service workers are not supported.');
}

//-------------------------------------------------------------------------------------------------

export { register };