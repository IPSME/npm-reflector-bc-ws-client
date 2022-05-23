
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

// https://stackoverflow.com/questions/34351804/how-to-declare-a-global-variable-in-react
//
const msgenv= {};

msgenv.broadcastChannel = new BroadcastChannel('');
msgenv.subscription_handler= null;

function subscribe(handler) {
    console.log('MsgEnv: subscribe');

    msgenv.subscription_handler= handler;
}

function unsubscribe(handler) {
    msgenv.subscription_handler= null;
}

msgenv.broadcastChannel.onmessage = event => {
	// console.log('msgenv_BroadcastChannel.onmessage: ['+ event.data +']'); 
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null
    if (msgenv.subscription_handler !== null)
        msgenv.subscription_handler(event.data);
}

function publish(str_msg) {
    msgenv.broadcastChannel.postMessage(str_msg);
}

//-------------------------------------------------------------------------------------------------

export { uuidv4, msgenv as default, subscribe, unsubscribe, publish }
