import ReconnectingWebSocket from 'reconnecting-websocket';
import { MsgCache, EntryContext } from '@ipsme/msgcache-dedup';

let msg_cache_= new MsgCache();
const knr_MSG_EXPIRATION_ms= 4000;

const rws_options= {
  maxRetries: 20,
}

// https://www.npmjs.com/package/reconnecting-websocket
// https://unpkg.com/browse/reconnecting-websocket@4.4.0/dist/
let rws = new ReconnectingWebSocket("ws://localhost:8082"); // wss://
console.log('REFL: rws:', rws);

var port;
var connections= [];

onconnect = function (e) {
	port = e.ports[0];

	// console.log('REFL: onconnect: ', e);

	// https://www.codemag.com/Article/2101071/Understanding-and-Using-Web-Workers
    const existingConnection= connections.find(connection => {
        return connection === port;
    });
    if (existingConnection === undefined || existingConnection == null)
        connections.push(port);	
	// ----

	port.onmessage = function (e) {
		// console.log(e.data);
		// var workerResult = "Result: ";
		// port.postMessage(workerResult);
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

//TODO: the reflector should be using the IPSME lib too
const bc = new BroadcastChannel('');

bc.onmessage = event => 
{
	if (event.data === undefined)
		return;

	// IPSME doesn't dictate that strings should be passed. The javascript broadcast ME allows
	// for objects to be passed, but the web socket doesn't support them, so drop non-strings.

	if (typeof(event.data) !== 'string') 
		return;

	let str_msg= event.data;
	// console.log('REFL-ws: msg: bc -> ws -- ', str_msg);

	// msg_cache.cache(str_msg, { ms_TTL_: 30000 })
	if (rws && (rws.readyState === WebSocket.OPEN))
		rws.send(str_msg);
}

//-------------------------------------------------------------------------------------------------

rws.onopen = function (event) {
	// console.log('REFL-ws: open: ', event);

	port.postMessage({ rws : 'INITd!' });
}

rws.onclose = function (event) {
	// console.log('REFL-ws: close: ', event);
}

rws.onmessage = function (event) 
{
	if (event.data === undefined)
		return;

	console.assert(typeof(event.data) === 'string', 'a msg coming from NSDNC must be a string');
	const str_msg = event.data;

	// console.log('REFL-ws: msg: bc <- ws -- ', str_msg);
	if (bc)
		bc.postMessage(str_msg);
}

rws.onerror = function (event) {
	// console.log('REFL-ws: err: ', event);
}
