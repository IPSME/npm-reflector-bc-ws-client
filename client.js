
const message = 'Client' // Try edit me
const bc = new BroadcastChannel('');

// Update header text
document.querySelector('#header').innerHTML = message

// Try other templates: Project -> New

// A handler that only logs the event to the console:
bc.onmessage = event => 
{
	console.log('blank BC msg ['+ event.data +']'); 

}

