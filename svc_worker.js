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
    navigator.serviceWorker.register('/sw.js').then(function(registration) 
    {
        // manually update service worker
        // registration.update();

        registration.addEventListener('updatefound', function() {
            // If updatefound is fired, it means that there's
            // a new service worker being installed.
            var installingWorker = registration.installing;
            console.log('A new service worker is being installed:', installingWorker);

            // You can listen for changes to the installing service worker's
            // state via installingWorker.onstatechange
        });

        // https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
        //

        registration.addEventListener('oninstall', function() {
            console.log('oninstall');
        });

        registration.addEventListener('onactivate', function() {
            // The primary use of onactivate is for cleanup of resources used in previous versions of a Service worker script.
            console.log('onactivate');
        });
    })
    .catch(function(error) {
        console.log('Service worker registration failed:', error);
    });
} 
else {
    console.log('Service workers are not supported.');
}
