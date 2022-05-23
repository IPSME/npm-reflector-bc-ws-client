
const k_VERSION= 2;

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

	  // console.log('REFL-ws: msg: BroadcastChannel -> ws -- ['+ str_msg +']');
    ws.send(str_msg);
}

//-------------------------------------------------------------------------------------------------
// https://web.dev/service-worker-lifecycle/

self.addEventListener("install", function(e) 
{
	console.log('REFL-ws: v'+ k_VERSION +' installing…');

	e.waitUntil( new Promise((resolve, reject) => {

		bc= new BroadcastChannel('');
		bc.onmessage = event => {
			let str_msg= event.data;
			async_send(str_msg);
		}
	
		resolve();
    
	}).then(self.skipWaiting()) );

});

self.addEventListener("activate", function(e) {
  return e.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", function() {});

// Reticulum will inject an overrided app name.
// eslint-disable-next-line prefer-const
let appFullName = "";

// DO NOT REMOVE/EDIT THIS COMMENT - META_TAGS

self.addEventListener("push", function(e) {
  const payload = JSON.parse(e.data.text());

  return e.waitUntil(
    self.clients.matchAll({ type: "window" }).then(function(clientList) {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url.indexOf(e.notification.data.hub_id) >= 0) return;
      }

      return self.registration.showNotification(appFullName, {
        body: "Someone has joined " + payload.hub_name,
        image: payload.image,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: payload.hub_id,
        data: { hub_url: payload.hub_url }
      });
    })
  );
});

self.addEventListener("notificationclick", function(e) {
  e.notification.close();

  e.waitUntil(
    self.clients.matchAll({ type: "window" }).then(function(clientList) {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url.indexOf(e.notification.data.hub_url) >= 0 && "focus" in client) return client.focus();
      }

      if (self.clients.openWindow) {
        return self.clients.openWindow(e.notification.data.hub_url);
      }
    })
  );
});
