
function handler_(str_msg) 
{
	console.log('CLIENT: handler(): BroadcastChannel msg ['+ str_msg +']'); 

}

IPSME_MsgEnv_subscribe(handler_);

IPSME_MsgEnv_publish('Sausage and worst');