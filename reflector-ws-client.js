// https://web.dev/service-worker-lifecycle/

self.addEventListener('install', event => 
{
	console.log('REFL-ws: vX installing…');

	// The waiting phase means you're only running one version of your site at once, but if you don't need that feature ...
	// self.skipWaiting()
	// It doesn't really matter when you call skipWaiting(), as long as it's during or before waiting

	// https://web.dev/service-worker-lifecycle/
	// the promise you pass to event.waitUntil() lets the browser know when your install completes, and if it was successful
	// event.waitUntil(...);
});

self.addEventListener('activate', event => 
{
	// this fires once the old service worker is gone

	// If you pass a promise to event.waitUntil() it'll buffer functional events (fetch, push, sync etc.) until the promise resolves
	// event.waitUntil(...)).then(() => {
	// 	console.log('V2 now ready to handle fetches!');
	// });

	console.log('REFL-ws: vX now ready to handle fetches!');

	// Once your service worker is ready to control clients and handle functional events like push and sync

	// You can take control of uncontrolled clients by calling clients.claim() within your service worker once it's activated
});

self.addEventListener('fetch', event => {
	const url = new URL(event.request.url); 
});


const ws = new WebSocket("ws://localhost:8082"); // wss://
const bc = new BroadcastChannel('');

ws.onopen = function(event) {
    console.log('REFL-ws: open: ['+ event +']');
    ws.send("Here's some text that the server is urgently awaiting!");
}

ws.onclose = function(event) {
    console.log('REFL-ws: close: ['+ event +']');
}


ws.onmessage = function(event) {
    console.log('REFL-ws: msg: ['+ event.data +'] -> BroadcastChannel');

	bc.postMessage(event.data);
}

ws.onerror = function(event) {
    console.log('REFL-ws: err: ['+ event +']');
}


