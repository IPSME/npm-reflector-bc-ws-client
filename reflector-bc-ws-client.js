// https://stackoverflow.com/questions/44118600/web-workers-how-to-import-modules

let ws = new WebSocket("ws://localhost:8082"); // wss://
console.log('ws:');

onconnect = function (e) {
	var port = e.ports[0];

	/*
	port.onmessage = function (e) {
		var workerResult = "Result: " + e.data[0] * e.data[1];
		port.postMessage(workerResult);

		console.log('PLG');
		ws.send('PLG')
	};
	*/
};

//-------------------------------------------------------------------------------------------------

const bc = new BroadcastChannel('');

bc.onmessage = event => {
	if (typeof(event.data) !== 'string')
	    return;

	const str_msg= event.data;
	console.log('REFL-ws: msg: bc -> ws -- ['+ str_msg +']');

	// msg_cache.cache(str_msg, { ms_TTL_: 30000 })
	if (ws && (ws.readyState === WebSocket.OPEN))
		ws.send(str_msg);
}

//-------------------------------------------------------------------------------------------------

ws.onopen = function (event) {
	console.log('REFL-ws: open: ', event);
}

ws.onclose = function (event) {
	console.log('REFL-ws: close: ', event);
}

ws.onmessage = function (event) {
	console.assert(typeof(event.data) === 'string', 'a msg coming from NSDNC must be a string');
	const str_msg = event.data;

	console.log('REFL-ws: msg: bc <- ws -- ['+ str_msg +']');
	if (bc)
		bc.postMessage(str_msg);
}

ws.onerror = function (event) {
	console.log('REFL-ws: err: ', event);
}
