### npm-reflector-ws-client

```
npm install @ipsme/reflector-ws-client@latest
```

```
// import the function reflector_ws_client.load()
import * as reflector_ws_client from '@ipsme/reflector-ws-client';
// -- OR --
// import * as reflector_ws_client from 'https://unpkg.com/@ipsme/reflector-ws-client@X.X.X';

// the SharedWorker reflector reflector-bc-ws-client.js must be moved from node_modules
// https://unpkg.com/browse/@ipsme/reflector-ws-client@X.X.X/
// below it has been copied via WebPack to './public'
reflector_ws_client.load(window, "./public/reflector-bc-ws-client.js",  function () {
	// ...
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
	logr : b_
}
```
