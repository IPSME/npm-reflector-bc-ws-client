
import * as IPSME_MsgEnv from '@ipsme/msgenv-broadcastchannel';
import { MsgCache, EntryContext } from '@ipsme/msgcache-dedup';
import ReconnectingWebSocket from 'reconnecting-websocket';

//-------------------------------------------------------------------------------------------------

// https://www.npmjs.com/package/reconnecting-websocket
// https://unpkg.com/browse/reconnecting-websocket@4.4.0/dist/
var rws_= undefined;

let msg_cache_= new MsgCache();
const knr_MSG_EXPIRATION_ms= 4000;

// TODO: https://emergent.systems/posts/bit-fields/
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
		},
		is_empty: function () {
			// https://bobbyhadz.com/blog/javascript-check-if-object-is-empty
			return Object.keys(_options).length === 0;
		}
    }
})();

//-------------------------------------------------------------------------------------------------
// bc -> ws

function handler_(msg)
{
	"use strict";

	if (msg === undefined)
		return;

	// IPSME doesn't dictate that strings should be passed. The javascript broadcast ME allows
	// for objects to be passed, but the web socket doesn't support them, so drop non-strings.

	if (typeof(msg) !== 'string') 
		return;

	let str_msg= msg;

	msg_cache_.cache(str_msg, new EntryContext(knr_MSG_EXPIRATION_ms));

	if (cfg_.logr&RDR) console.log('REFL-ws: send: bc -> ws -- ', str_msg);
	if (rws_ && (rws_.readyState === WebSocket.OPEN))
		rws_.send(str_msg);
}

// TODO: the config options are set are global are init'd, so this never outputs debug info
IPSME_MsgEnv.subscribe(handler_);

//-------------------------------------------------------------------------------------------------
// bc <- ws

function ws_handler_open_ (event) {
	if (cfg_.logr&CXN) console.log('REFL-ws: open: ', event);
	port_.postMessage({ sharedworker : 'INITd!' });
}

function ws_handler_close_ (event) {
	if (cfg_.logr&CXN) console.log('REFL-ws: close: ', event);
}

function ws_handler_onmessage_ (event) 
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

function ws_handler_onerror_ (event) {
	if (cfg_.logr&CXN) console.log('REFL-ws: err: ', event);
}

//-------------------------------------------------------------------------------------------------

var port_;
var connections_= [];

onconnect = function (e) {
	port_ = e.ports[0];

	// console.log('REFL: onconnect: ', e);

	// if (rws_ && (rws_.readyState === WebSocket.OPEN))
	// 	port_.postMessage({ sharedworker : 'INITd!' });

	// https://www.codemag.com/Article/2101071/Understanding-and-Using-Web-Workers
    const existingConnection= connections_.find(connection => {
        return connection === port_;
    });
    if (existingConnection === undefined || existingConnection == null)
        connections_.push(port_);	

	// ----

	port_.onmessage= function (e) {
		"use strict";		
		// port.postMessage(workerResult);

		if (cfg_.logr&CXN) console.log('REFL: port.onmessage: options: ', cfg_.options);
			
		if (rws_) {
			// We are here when another page also loads the sharedworker
			// prevent cfg_.options from possibly being clobbered by a second instance
			
			if (rws_.readyState === WebSocket.OPEN)
				port_.postMessage({ sharedworker : 'INITd!' });

			return;
		}

		cfg_.options= e.data;

		IPSME_MsgEnv.config= {
			prefix : 'REFL-ws: ',
			logr : (cfg_.logr&MSG) ? (cfg_.logr&CXN) | (cfg_.logr&RDR) : 0,
		}

		rws_= new ReconnectingWebSocket(cfg_.url, [], cfg_.rws); // wss://
		rws_.onopen= ws_handler_open_;
		rws_.onclose= ws_handler_close_;
		rws_.onmessage= ws_handler_onmessage_;
		rws_.onerror= ws_handler_onerror_;

		if (cfg_.logr&CXN) console.log('REFL: rws:', rws_);
	};
};

//-------------------------------------------------------------------------------------------------
