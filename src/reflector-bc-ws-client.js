
import { BitLogr } from '@knev/bitlogr';
import * as IPSME_MsgEnv from '@ipsme/msgenv-broadcastchannel';
import { MsgCache, MsgContext } from '@ipsme/msgcache-dedup';
import ReconnectingWebSocket from 'reconnecting-websocket';

import { l_ } from './logr.labels.mjs';

//-------------------------------------------------------------------------------------------------

// https://www.npmjs.com/package/reconnecting-websocket
// https://unpkg.com/browse/reconnecting-websocket@4.4.0/dist/
var rws_= undefined;

let msgcache_= undefined;
const knr_MSG_EXPIRATION_ms= 4000;

let LOGR_= new BitLogr();
LOGR_.labels= l_;

const str_default_ws_url_= 'ws://localhost:8023';

var cfg_= (function() {
    let _options= {};

	// const reflector_options= {
	// 	url : "ws://localhost:8082",
	// 	rws : {
	// 		maxRetries: 20,
	// 		debug: true
	// 	},
	// 	log : cfg_.logr
	// }

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

	msgcache_.cache(str_msg, new MsgContext(knr_MSG_EXPIRATION_ms));

	LOGR_.log(l_.REFL, 'REFL-ws: send: bc -> ws -- ', str_msg);
	if (rws_ && (rws_.readyState === WebSocket.OPEN))
		rws_.send(str_msg);
}

// TODO: the config options are set are global are init'd, so this never outputs debug info
IPSME_MsgEnv.subscribe(handler_);

//-------------------------------------------------------------------------------------------------
// bc <- ws

function ws_handler_open_ (event) {
	LOGR_.log(l_.CXNS, 'REFL-ws: open: ', event);
	port_.postMessage({ sharedworker : 'INITd!' });
}

function ws_handler_close_ (event) {
	LOGR_.log(l_.CXNS, 'REFL-ws: close: ', event);
}

function ws_handler_onmessage_ (event) 
{
	if (event.data === undefined)
		return;

	console.assert(typeof(event.data) === 'string', 'a msg coming from NSDNC must be a string');
	const str_msg = event.data;

	let [ b_res, ctx ]= msgcache_.contains(str_msg)
	if (b_res) {
		LOGR_.log(l_.DUPS, 'REFL-ws: *DUP | <- ws -- ', str_msg); 
		return;
	}

	LOGR_.log(l_.REFL, 'REFL-ws: publish: bc <- ws -- ', str_msg);
	IPSME_MsgEnv.publish(str_msg);
}

function ws_handler_onerror_ (event) {
	LOGR_.log(l_.CXNS, 'REFL-ws: err: ', event);
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

		LOGR_.log(l_.CXNS, 'REFL: port.onmessage: options: ', cfg_.options);
			
		if (rws_) {
			// We are here when another page also loads the sharedworker
			// prevent cfg_.options from possibly being clobbered by a second instance
			
			if (rws_.readyState === WebSocket.OPEN)
				port_.postMessage({ sharedworker : 'INITd!' });

			return;
		}

		cfg_.options= e.data;

		IPSME_MsgEnv.config.options= {
			prefix : 'REFL-ws: ',
			logr : cfg_.options.logr
		}

		MsgCache.options= cfg_.options;

		if (! msgcache_)
		msgcache_= new MsgCache();

		rws_= new ReconnectingWebSocket(cfg_.url, [], cfg_.rws); // wss://
		rws_.onopen= ws_handler_open_;
		rws_.onclose= ws_handler_close_;
		rws_.onmessage= ws_handler_onmessage_;
		rws_.onerror= ws_handler_onerror_;

		LOGR_.log(l_.CXNS, 'REFL: rws:', rws_);
	};
};

//-------------------------------------------------------------------------------------------------
