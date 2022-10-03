

function load(window, str_worker_path, callback_INITd)
{
	if (!!window.SharedWorker) 
	{
		const sharedworker= new SharedWorker( str_worker_path ); // "./reflector-bc-ws-client.js"
		sharedworker.port.start();

		console.log("new SharedWorker", sharedworker);

		// sharedworker.port.postMessage({ws : "ws://localhost:8082"});

		sharedworker.port.onmessage = function (e) {
			// console.log(e.lastEventId);
			let json= e.data;
			if (json.sharedworker === 'INITd!')
				callback_INITd();
		};
	}
}

//-------------------------------------------------------------------------------------------------

export { load };
