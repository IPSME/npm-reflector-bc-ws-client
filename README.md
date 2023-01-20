# npm-reflector-ws-client

This library contains the code for a running an IPSME "reflector" client as a SharedWorker. Messages are reflected from the web messaging environment (ME), namely a BroadcastChannel, to a the IPSME reflector server via a WebSocket.
  
> ### IPSME- Idempotent Publish/Subscribe Messaging Environment
> https://dl.acm.org/doi/abs/10.1145/3458307.3460966

## Installation

In a browser environment, this reflector can be loaded via `unpkg.com`
```
import * as sharedworker_reflector from 'https://unpkg.com/@ipsme/reflector-ws-client@X.X.X';
```
However! The SharedWorker itself (`dist/reflector-bc-ws-client.js` in the `node_modules` package) must be copied to a publicly accessible location, so that it can be loaded by `sharedworker_reflector.load(...)`.

```
sharedworker_reflector.load(window, "./reflector/reflector-bc-ws-client.js", function () {
	// initialization code ...
});
```
In the above code snippet the reflector has been copied to the location `<URL>/reflector`.  When the reflector has successfully loaded the callback function will be called allowing for initialization code e.g., announcement messages.

## Config options

```
sharedworker_reflector.config.options= {
	// url : "ws://localhost:8023",
	rws : {
		maxRetries:  20,
		// debug: true
	},
	logr :  logr_
}
// options should be loaded before the `load(...)` function
sharedworker_reflector.load(...) {}
```
< to be continued ... >
