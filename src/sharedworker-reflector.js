
const CXN= 0b1 << 0;	// connections
		
var cfg_= (function() {
    let _options= {};

    return {
		get logr() {
			return (_options.logr === undefined) ? 0 : _options.logr;
		},
		get options() { return _options; },
		set options(obj) {
			_options= obj;
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
				if (cfg_.logr&CXN) console.log('REFL: sharedworker.load: INITd!');
				callback_INITd();
			}
		};

		if (cfg_.logr&CXN) console.log("new SharedWorker", sharedworker);
	}
}

//-------------------------------------------------------------------------------------------------

export { cfg_ as config, load };
