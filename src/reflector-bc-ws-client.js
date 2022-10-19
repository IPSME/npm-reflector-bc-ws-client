
import * as IPSME_MsgEnv from '@ipsme/msgenv-broadcastchannel';
import { MsgCache, EntryContext } from '@ipsme/msgcache-dedup';
import ReconnectingWebSocket from 'reconnecting-websocket';

//-------------------------------------------------------------------------------------------------

let msg_cache_= new MsgCache();
const knr_MSG_EXPIRATION_ms= 4000;

const CXN= 0b1 << 0;	// connections
const RDR= 0b1 << 1;	// redirect
const DUP= 0b1 << 2;	// duplicates
const MSG= 0b1 << 3;	// MsgEnv

const str_default_ws_url_= 'ws://localhost:8082';

// const reflector_options= {
// 	url : "ws://localhost:8082",
// 	rws : {
// 		maxRetries: 20,
// 		debug: true
// 	},
// 	log : cfg_.logr
// }

var cfg_= (function() {
    let _options= {};

    return {
		get url() {
			return (_options.url === undefined) ? str_default_ws_url_ : _options.url;
		},
		get rws() {
			return (_options.rws === undefined) ? {} : _options.rws;
		},
		get logr() {
			return (_options.logr === undefined) ? 0 : _options.logr;
		},
		get options() { return _options; },
		set options(obj) {
			_options= obj;
		}
    }
})();

// https://www.npmjs.com/package/reconnecting-websocket
// https://unpkg.com/browse/reconnecting-websocket@4.4.0/dist/
let rws = new ReconnectingWebSocket(cfg_.url, [], cfg_.rws); // wss://
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
		// port.postMessage(workerResult);

		cfg_.options= e.data;

		if (cfg_.logr&CXN) console.log('REFL: port.onmessage: options: ', cfg_.options);
			
		IPSME_MsgEnv.config= {
			prefix : 'REFL-ws: ',
			logr : (cfg_.logr&MSG) ? (cfg_.logr&CXN) | (cfg_.logr&RDR) : 0,
		}

		rws.close();
		rws = new ReconnectingWebSocket(cfg_.url, [], cfg_.rws); // wss://
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

	if (cfg_.logr&RDR) console.log('REFL-ws: send: bc -> ws -- ', str_msg);
	if (rws && (rws.readyState === WebSocket.OPEN))
		rws.send(str_msg);
}

// TODO: the config options are set are global are init'd, so this never outputs debug info
IPSME_MsgEnv.subscribe(handler_);

//-------------------------------------------------------------------------------------------------
// bc <- ws

rws.onopen = function (event) {
	if (cfg_.logr&CXN) console.log('REFL-ws: open: ', event);
	port.postMessage({ sharedworker : 'INITd!' });
}

rws.onclose = function (event) {
	if (cfg_.logr&CXN) console.log('REFL-ws: close: ', event);
}

rws.onmessage = function (event) 
{
	if (event.data === undefined)
		return;

	console.assert(typeof(event.data) === 'string', 'a msg coming from NSDNC must be a string');
	const str_msg = event.data;

	let [ b_res, ctx ]= msg_cache_.contains(str_msg)
	if (b_res) {
		if (cfg_.logr&DUP) console.log('REFL-ws: *DUP | <- ws -- ', str_msg); 
		return;
	}

	if (cfg_.logr&RDR) console.log('REFL-ws: publish: bc <- ws -- ', str_msg);
	IPSME_MsgEnv.publish(str_msg);
}

rws.onerror = function (event) {
	if (cfg_.logr&CXN) console.log('REFL-ws: err: ', event);
}
