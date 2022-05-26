// https://www.npmjs.com/package/reconnecting-websocket
// https://unpkg.com/browse/reconnecting-websocket@4.4.0/dist/
import ReconnectingWebSocket from './reconnecting-websocket-mjs.js';

const k_VERSION= 2;

//-------------------------------------------------------------------------------------------------

let bc= null;
let rws= null;

let websocket_onclose= function(event) {
  console.log('REFL-ws: close: ['+ event +']');
}

let websocket_onmessage = function(event) {
	let str_msg= event.data;
  // console.log('REFL-ws: msg: BroadcastChannel <- ws -- ['+ str_msg +']');
	if (bc)
		bc.postMessage(str_msg);
}

let websocket_onerror= function(event) {
	console.log('REFL-ws: err: ['+ event +']');
}		

//-------------------------------------------------------------------------------------------------
// https://web.dev/service-worker-lifecycle/

self.addEventListener("install", function(e) 
{
	console.log('REFL-ws: v'+ k_VERSION +' installing…');

	e.waitUntil( new Promise((resolve, reject) => {

    console.log('REFL-ws: opening BC');

		bc= new BroadcastChannel('');
		bc.onmessage = function(event) {
			let str_msg= event.data;
      // console.log('REFL-ws: msg: BroadcastChannel -> ws -- ['+ str_msg +']');
      if (rws && (rws.readyState === WebSocket.OPEN) )
			  rws.send(str_msg);
		}

    // console.log('REFL-ws: opening RWS');

		rws= new ReconnectingWebSocket("ws://localhost:8082"); // wss://
		rws.onopen= function(event) {
      // console.log('REFL-ws: open: ['+ event +']');
      resolve();
    }
    
		rws.onclose= websocket_onclose;
		rws.onmessage= websocket_onmessage;
		rws.onerror= websocket_onerror;	
    
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
