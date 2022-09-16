

function load(window, callback_INITd)
{
	if (!!window.SharedWorker) 
	{
		const sharedworker= new SharedWorker("./reflector-bc-ws-client.js");
		sharedworker.port.start();

		console.log("new SharedWorker", sharedworker);

		// sharedworker.port.postMessage({ws : "ws://localhost:8082"});

		sharedworker.port.onmessage = function (e) {
			// console.log(e.lastEventId);
			let json_ws_Open= e.data;
			if (json_ws_Open.ws === 'INITd!')
				callback_INITd();
		};
	}
}

//-------------------------------------------------------------------------------------------------

export { load };
