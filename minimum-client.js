
const bc = new BroadcastChannel('');

bc.onmessage = event => 
{
	console.log('CLIENT: BroadcastChannel msg ['+ event.data +']'); 

}

