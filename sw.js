
const ws = new WebSocket("ws://localhost:8082"); // wss://

ws.onopen = function(event) {
    console.log('open: ['+ event +']');
    ws.send("Here's some text that the server is urgently awaiting!");
}

ws.onclose = function(event) {
    console.log('close: ['+ event +']');
}


ws.onmessage = function(event) {
    console.log('msg: ['+ event.data +'] -> BC');
}

ws.onerror = function(event) {
    console.log('err: ['+ event +']');
}


