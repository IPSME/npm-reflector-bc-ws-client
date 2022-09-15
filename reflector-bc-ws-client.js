// https://stackoverflow.com/questions/44118600/web-workers-how-to-import-modules

let ws = new WebSocket("ws://localhost:8082"); // wss://
console.log('ws:');

var port;
var connections= [];

onconnect = function (e) {
	port = e.ports[0];

	console.log('REFL: onconnect: ', e);

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
	console.log('REFL-ws: msg: bc -> ws -- ', str_msg);

	// msg_cache.cache(str_msg, { ms_TTL_: 30000 })
	if (ws && (ws.readyState === WebSocket.OPEN))
		ws.send(str_msg);
}

//-------------------------------------------------------------------------------------------------

ws.onopen = function (event) {
	console.log('REFL-ws: open: ', event);

	port.postMessage({ ws : 'INITd!' });
}

ws.onclose = function (event) {
	console.log('REFL-ws: close: ', event);
}

ws.onmessage = function (event) 
{
	if (event.data === undefined)
		return;

	console.assert(typeof(event.data) === 'string', 'a msg coming from NSDNC must be a string');
	const str_msg = event.data;

	console.log('REFL-ws: msg: bc <- ws -- ', str_msg);
	if (bc)
		bc.postMessage(str_msg);
}

ws.onerror = function (event) {
	console.log('REFL-ws: err: ', event);
}
