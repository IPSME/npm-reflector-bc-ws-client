
import { BitLogr } from '@knev/bitlogr';
import { l_ } from './logr.labels.mjs';

let LOGR_= new BitLogr();
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
				LOGR_.toggled= _options.logr
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

//-------------------------------------------------------------------------------------------------

export { cfg_ as config, load, l_ as l };
