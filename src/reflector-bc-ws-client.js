
import * as IPSME_MsgEnv from '@ipsme/msgenv-broadcastchannel';
import { MsgCache, EntryContext } from '@ipsme/msgcache-dedup';
import ReconnectingWebSocket from 'reconnecting-websocket';

let msg_cache_= new MsgCache();
const knr_MSG_EXPIRATION_ms= 4000;

const CXN= 0b0001;	// operations
const NOT= 0b0010;	// UNUSED
const RDR= 0b0100;	// redirect
const DUP= 0b1000;	// duplicates

// const rws_options = {
// 	maxRetries: 20,
// 	debug: true
// }

let b_= 0;
let ws_url_= "ws://localhost:8082";
let ws_options_= {}

// https://www.npmjs.com/package/reconnecting-websocket
// https://unpkg.com/browse/reconnecting-websocket@4.4.0/dist/
let rws = new ReconnectingWebSocket(ws_url_, [], ws_options_); // wss://
// console.log('REFL: rws:', rws);

//-------------------------------------------------------------------------------------------------

var port;
var connections= [];

onconnect = function (e) {
	port = e.ports[0];

	// console.log('REFL: onconnect: ', e);

	if (rws && (rws.readyState === WebSocket.OPEN))
		port.postMessage({ sharedworker : 'INITd!' });

	// https://www.codemag.com/Article/2101071/Understanding-and-Using-Web-Workers
    const existingConnection= connections.find(connection => {
        return connection === port;
    });
    if (existingConnection === undefined || existingConnection == null)
        connections.push(port);	
	// ----

	port.onmessage= function (e) {
		const options= e.data;
		
		// port.postMessage(workerResult);

		if (options.log !== undefined)
			b_= options.log;

		if (b_&CXN) console.log('REFL: port.onmessage: ', options);

		if (options.url !== undefined)
			ws_url_= options.url;

		if (options.rws !== undefined)
			ws_options_= options.rws;
			
		rws.close();
		rws = new ReconnectingWebSocket(ws_url_, [], ws_options_); // wss://
	};
};

//-------------------------------------------------------------------------------------------------

function is_JSON(obj) {
	try {
		JSON.parse(obj);
	}
	catch (err) {
		return false;
	}
	return true;
}

//-------------------------------------------------------------------------------------------------
// bc -> ws

function handler_(msg)
{
	if (msg === undefined)
		return;

	// IPSME doesn't dictate that strings should be passed. The javascript broadcast ME allows
	// for objects to be passed, but the web socket doesn't support them, so drop non-strings.

	if (typeof(msg) !== 'string') 
		return;

	let str_msg= msg;

	msg_cache_.cache(str_msg, new EntryContext(knr_MSG_EXPIRATION_ms));

	if (b_&RDR) console.log('REFL-ws: send: bc -> ws -- ', str_msg);
	if (rws && (rws.readyState === WebSocket.OPEN))
		rws.send(str_msg);
}

IPSME_MsgEnv.subscribe(handler_);

//-------------------------------------------------------------------------------------------------
// bc <- ws

rws.onopen = function (event) {
	if (b_&CXN) console.log('REFL-ws: open: ', event);
	port.postMessage({ sharedworker : 'INITd!' });
}

rws.onclose = function (event) {
	if (b_&CXN) console.log('REFL-ws: close: ', event);
}

rws.onmessage = function (event) 
{
	if (event.data === undefined)
		return;

	console.assert(typeof(event.data) === 'string', 'a msg coming from NSDNC must be a string');
	const str_msg = event.data;

	let [ b_res, ctx ]= msg_cache_.contains(str_msg)
	if (b_res) {
		if (b_&DUP) console.log('REFL-ws: *DUP | <- ws -- ', str_msg); 
		return;
	}

	if (b_&RDR) console.log('REFL-ws: publish: bc <- ws -- ', str_msg);
	IPSME_MsgEnv.publish(str_msg);
}

rws.onerror = function (event) {
	if (b_&CXN) console.log('REFL-ws: err: ', event);
}
