// console.log('OUT', __name({variableName}) );

function labelsToBigInt_$2(ref, obj, ignore= false) {
	let bigInt = BigInt(0);
	for (const [t,v] of Object.entries(obj)) {
		if ( ( ignore || v ) && ref[t])
			bigInt|= BigInt( ref[t] );			
		// console.log('0b'+ bigInt.toString(2) );
	}
	return bigInt;
}

function l_LL(obj, x) {
	let obj_new= {};
	for (var [k,v] of Object.entries(obj))
		obj_new[k]= v<<x;
	return obj_new;
}

//-------------------------------------------------------------------------------------------------

function handler_default_$2( /* ... */ ) {
	// https://stackoverflow.com/questions/18746440/passing-multiple-arguments-to-console-log
	var args = Array.prototype.slice.call(arguments);
	console.log.apply(console, args);
}

//-------------------------------------------------------------------------------------------------
	
let BitLogr$2 = class BitLogr {
	constructor() {
		this._handler_log= handler_default_$2;
		this._Bint_labels= BigInt(0);
		this._Bint_toggled= BigInt(0);

		BitLogr$2.prototype['log']= function (nr_logged, /* ... */ ) {
			// console.log('NOP')
		};
	}

	set handler(fx) {
		this._handler_log= fx;
	}

	get labels() { return this._Bint_labels; }
	set labels(obj) {
		this._Bint_labels= obj;
		this._Bint_toggled= BigInt(0);
	}

	// put= function(label, abbrv) {
	// 	let name= __name(label);
	// 	_labels[name]= label[name];
	// 	console.log(_labels);
	// }

	get toggled() { return this._Bint_toggled; }
	set toggled(obj) {
		this._Bint_toggled= labelsToBigInt_$2(this._Bint_labels, obj);

		BitLogr$2.prototype['log']= function (nr_logged, /* ... */ ) {
			if ( (BigInt(nr_logged) & this._Bint_toggled) === BigInt(0))
				return false;
		
			var args = Array.prototype.slice.call(arguments);
			args.shift(); // remove first arg: nr_logged
			this._handler_log.apply(this, args);
	
			return true;
		};
	}

	// log= function (nr_logged, /* ... */ ) {}
};

// console.log('OUT', __name({variableName}) );

function labelsToBigInt_$1(ref, obj, ignore= false) {
	let bigInt = BigInt(0);
	for (const [t,v] of Object.entries(obj)) {
		if ( ( ignore || v ) && ref[t])
			bigInt|= BigInt( ref[t] );			
		// console.log('0b'+ bigInt.toString(2) );
	}
	return bigInt;
}

//-------------------------------------------------------------------------------------------------

function handler_default_$1( /* ... */ ) {
	// https://stackoverflow.com/questions/18746440/passing-multiple-arguments-to-console-log
	var args = Array.prototype.slice.call(arguments);
	console.log.apply(console, args);
}

//-------------------------------------------------------------------------------------------------
	
let BitLogr$1 = class BitLogr {
	constructor() {
		this._handler_log= handler_default_$1;
		this._Bint_labels= BigInt(0);
		this._Bint_toggled= BigInt(0);

		BitLogr$1.prototype['log']= function (nr_logged, /* ... */ ) {
			// console.log('NOP')
		};
	}

	set handler(fx) {
		this._handler_log= fx;
	}

	get labels() { return this._Bint_labels; }
	set labels(obj) {
		this._Bint_labels= obj;
		this._Bint_toggled= BigInt(0);
	}

	// put= function(label, abbrv) {
	// 	let name= __name(label);
	// 	_labels[name]= label[name];
	// 	console.log(_labels);
	// }

	get toggled() { return this._Bint_toggled; }
	set toggled(obj) {
		this._Bint_toggled= labelsToBigInt_$1(this._Bint_labels, obj);

		BitLogr$1.prototype['log']= function (nr_logged, /* ... */ ) {
			if ( (BigInt(nr_logged) & this._Bint_toggled) === BigInt(0))
				return false;
		
			var args = Array.prototype.slice.call(arguments);
			args.shift(); // remove first arg: nr_logged
			this._handler_log.apply(this, args);
	
			return true;
		};
	}

	// log= function (nr_logged, /* ... */ ) {}
};

let LOGR_$2= new BitLogr$1();

const l_$2 = {
	MsgEnv : 0b1 << 0,	// MsgEnv
	CXNS : 0b1 << 1,	// connections
	REFL : 0b1 << 2,	// reflection
};
LOGR_$2.labels= l_$2;

// console.log('OUT', __name({variableName}) );

function labelsToBigInt_(ref, obj, ignore= false) {
	let bigInt = BigInt(0);
	for (const [t,v] of Object.entries(obj)) {
		if ( ( ignore || v ) && ref[t])
			bigInt|= BigInt( ref[t] );			
		// console.log('0b'+ bigInt.toString(2) );
	}
	return bigInt;
}

//-------------------------------------------------------------------------------------------------

function handler_default_( /* ... */ ) {
	// https://stackoverflow.com/questions/18746440/passing-multiple-arguments-to-console-log
	var args = Array.prototype.slice.call(arguments);
	console.log.apply(console, args);
}

//-------------------------------------------------------------------------------------------------
	
class BitLogr {
	constructor() {
		this._handler_log= handler_default_;
		this._Bint_labels= BigInt(0);
		this._Bint_toggled= BigInt(0);

		BitLogr.prototype['log']= function (nr_logged, /* ... */ ) {
			// console.log('NOP')
		};
	}

	set handler(fx) {
		this._handler_log= fx;
	}

	get labels() { return this._Bint_labels; }
	set labels(obj) {
		this._Bint_labels= obj;
		this._Bint_toggled= BigInt(0);
	}

	// put= function(label, abbrv) {
	// 	let name= __name(label);
	// 	_labels[name]= label[name];
	// 	console.log(_labels);
	// }

	get toggled() { return this._Bint_toggled; }
	set toggled(obj) {
		this._Bint_toggled= labelsToBigInt_(this._Bint_labels, obj);

		BitLogr.prototype['log']= function (nr_logged, /* ... */ ) {
			if ( (BigInt(nr_logged) & this._Bint_toggled) === BigInt(0))
				return false;
		
			var args = Array.prototype.slice.call(arguments);
			args.shift(); // remove first arg: nr_logged
			this._handler_log.apply(this, args);
	
			return true;
		};
	}

	// log= function (nr_logged, /* ... */ ) {}
}

let LOGR_$1= new BitLogr();

const l_$1 = {
	MsgCache : 0b1 << 0,	// MsgCache
	ADD_REMOVE : 0b1 << 1,	// add/remove
};
LOGR_$1.labels= l_$1;

const l_ = {
	// Reflector_IPC_main : 0b1 << 0,
	DUPS				: 0b1 << 1,	// duplicates
	... l_LL(l_$2, 4),
	... l_LL(l_$1, 8),
};

let LOGR_= new BitLogr$2();
LOGR_.labels= l_;

//-------------------------------------------------------------------------------------------------

var cfg_= (function() {
    let _options= {};

    return {
		get logr() {
			return (_options.logr === undefined) ? 0 : _options.logr;
		},
		get options() { return _options; },
		set options(obj) {
			_options= obj;
			if (_options.logr) // && options_.logr[ __name(l_) ] )
				LOGR_.toggled= _options.logr;
		}
    }
})();

function load(window, str_worker_path, callback_INITd)
{
	if (!!window.SharedWorker) 
	{
		const sharedworker= new SharedWorker( str_worker_path ); // "./reflector-bc-ws-client.js"
		sharedworker.port.start();
		sharedworker.port.postMessage(cfg_.options);

		sharedworker.port.onmessage = function (e) {
			// console.log(e.lastEventId);
			let json= e.data;
			if (json.sharedworker === 'INITd!') {
				LOGR_.log(l_.CXNS, 'REFL: sharedworker.load: INITd!');
				callback_INITd();
			}
		};

		LOGR_.log(l_.CXNS, "new SharedWorker", sharedworker);
	}
}

export { cfg_ as config, l_ as l, load };
