
function handler_(str_msg) 
{
//	console.log('CLIENT: handler(): BroadcastChannel msg ['+ str_msg +']'); 

}

IPSME_MsgEnv_subscribe(handler_);

IPSME_MsgEnv_publish('Sausage and worst[0]');

var pubcount= 0;
function btn_Click(str_msg) {
	window.pubcount++;
	IPSME_MsgEnv_publish(str_msg +'['+ pubcount +']');
}
