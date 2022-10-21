### npm-reflector-ws-client

```
npm install @ipsme/reflector-ws-client@latest
```

```
// import the function reflector_ws_client.load()
import * as reflector_ws_client from '@ipsme/reflector-ws-client';
// -- OR --
// import * as reflector_ws_client from 'https://unpkg.com/@ipsme/reflector-ws-client@X.X.X';

// the SharedWorker reflector reflector-bc-ws-client.js must be copied from node_modules
// https://unpkg.com/browse/@ipsme/reflector-ws-client@X.X.X/
// in this example it has been copied (via WebPack) to './public'
reflector_ws_client.load(window, "./public/reflector-bc-ws-client.js",  function () {
	// run init code ...
});
```

----

##### config/debugging options
```
reflector_ws_client.config.options=  {
	// url : "ws://localhost:8082",
	rws : {
		maxRetries: 20,
		// debug: true
	},
	logr : 0
}

reflector_ws_client.load(...) {}
```
