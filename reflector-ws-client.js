// https://web.dev/service-worker-lifecycle/

const k_VERSION= 1;

//-------------------------------------------------------------------------------------------------

let bc= null;
let ws= null;

let websocket_onopen= function(event) {
	console.log('REFL-ws: open: ['+ event +']');

	connection_resolvers.forEach(r => r.resolve());
}

let websocket_onclose= function(event) {
    console.log('REFL-ws: close: ['+ event +']');
	ws= null;
}

let websocket_onmessage = function(event) {
	let str_msg= event.data;
    console.log('REFL-ws: msg: BroadcastChannel <- ws -- ['+ str_msg +']');
	if (bc)
		bc.postMessage(str_msg);
}

let websocket_onerror= function(event) {
	console.log('REFL-ws: err: ['+ event +']');
	ws= null;
}		

// https://stackoverflow.com/questions/23051416/uncaught-invalidstateerror-failed-to-execute-send-on-websocket-still-in-co
//
let connection_resolvers= [];
let checkConnection = () => {

	if (ws === null)
	{
		ws= new WebSocket("ws://localhost:8082"); // wss://

		ws.onopen= websocket_onopen;
		ws.onclose= websocket_onclose;
		ws.onmessage= websocket_onmessage;
		ws.onerror= websocket_onerror;
	}

    return new Promise((resolve, reject) => {
		if (ws && (ws.readyState === WebSocket.OPEN) )
		{
			resolve();
			return;
		}

		connection_resolvers.push({resolve, reject});
    });
}

async function async_send(str_msg) {
    await checkConnection();

	console.log('REFL-ws: msg: BroadcastChannel -> ws -- ['+ str_msg +']');
    ws.send(str_msg);
}

//-------------------------------------------------------------------------------------------------
// https://web.dev/service-worker-lifecycle/

self.addEventListener('install', event => 
{
	console.log('REFL-ws: v'+ k_VERSION +' installing…');

	// The waiting phase means you're only running one version of your site at once, but if you don't need that feature ...
	// self.skipWaiting()
	// It doesn't really matter when you call skipWaiting(), as long as it's during or before waiting

	// https://web.dev/service-worker-lifecycle/
	// the promise you pass to event.waitUntil() lets the browser know when your install completes, and if it was successful

	event.waitUntil( new Promise((resolve, reject) => {

		bc= new BroadcastChannel('');
		bc.onmessage = event => {
			let str_msg= event.data;
			async_send(str_msg);
		}
	
		resolve();
	}) );

});

self.addEventListener('activate', event => 
{
	// this fires once the old service worker is gone

	// If you pass a promise to event.waitUntil() it'll buffer functional events (fetch, push, sync etc.) until the promise resolves
	// event.waitUntil(...)).then(() => {
	// 	console.log('V2 now ready to handle fetches!');
	// });

	console.log('REFL-ws: v'+ k_VERSION +' now ready to handle fetches!');

	// Once your service worker is ready to control clients and handle functional events like push and sync

	// You can take control of uncontrolled clients by calling clients.claim() within your service worker once it's activated
});

self.addEventListener('fetch', event => {
	const url = new URL(event.request.url); 
});

//-------------------------------------------------------------------------------------------------
