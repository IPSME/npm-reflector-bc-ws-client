// https://www.npmjs.com/package/reconnecting-websocket
// https://unpkg.com/browse/reconnecting-websocket@4.4.0/dist/
import ReconnectingWebSocket from './reconnecting-websocket-mjs.js';

const k_VERSION= 1;

//-------------------------------------------------------------------------------------------------

console.log('REFL-ws: opening rws & bc');

const rws_options= {
  maxRetries: 20,
}

let rws= new ReconnectingWebSocket("ws://localhost:8082"); // wss://

