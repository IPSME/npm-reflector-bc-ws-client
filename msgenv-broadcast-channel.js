
// var global_subscription_handler= null;

//-------------------------------------------------------------------------------------------------

// https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid
//
function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}
  
// console.log(uuidv4());

//-------------------------------------------------------------------------------------------------
// MsgEnv:

console.log('MsgEnv: new BroadcastChannel()');
const msgenv_BroadcastChannel = new BroadcastChannel('');

function IPSME_MsgEnv_subscribe(handler) {
    window.global_subscription_handler= handler;
}

function IPSME_MsgEnv_unsubscribe(handler) {
    window.global_subscription_handler= null;
}

// https://stackoverflow.com/questions/23051416/uncaught-invalidstateerror-failed-to-execute-send-on-websocket-still-in-co
//
let connection_resolvers= [];
let checkConnection = () => {
    return new Promise((resolve, reject) => {
        if (global_ServiceWorker) {
            if (global_ServiceWorker.state === "activated") {
                resolve();
                return;
            }
        }

        connection_resolvers.push({resolve, reject});
    });
}

msgenv_BroadcastChannel.onmessage = event => {
    let msg= event.data;
    console.log('MsgEnv: onmessage: ['+ msg +']');

	// console.log('msgenv_BroadcastChannel.onmessage: ['+ event.data +']'); 
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null
    if (window.global_subscription_handler !== null)
        window.global_subscription_handler(msg);
}

async function async_publish(str_msg) {
    await checkConnection();

    console.log('MsgEnv: async_publish ['+ str_msg +']');
    msgenv_BroadcastChannel.postMessage(str_msg);
}

function IPSME_MsgEnv_publish(str_msg) {
	async_publish(str_msg);
}
