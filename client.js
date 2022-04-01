const message = 'Client calling' // Try edit me

// Update header text
document.querySelector('#header').innerHTML = message

// Try other templates: Project -> New

// Connection to a broadcast channel
const bc = new BroadcastChannel('test_channel');

// A handler that only logs the event to the console:
bc.onmessage = event => 
{
	console.log('BC msg ['+ event.data +']'); 

}

// Log to console
console.log(message)

// Example of sending of a very simple message
//bc.postMessage('This is a test message.');


