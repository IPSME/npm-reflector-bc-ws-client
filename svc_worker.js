if ('serviceWorker' in navigator) 
{
    navigator.serviceWorker.register('/sw.js').then(function(registration) 
    {
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
