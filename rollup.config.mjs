
import resolve from '@rollup/plugin-node-resolve';
// import commonjs from '@rollup/plugin-commonjs';
// import json from '@rollup/plugin-json';
import dts from "rollup-plugin-dts";

export default [
	{
		input: 'src/sharedworker-reflector.mjs',
		output: {
			file: 'dist/sharedworker-reflector.es.mjs',
			format: 'es'
		},
		// plugins: [resolve(), commonjs(), json()]
		plugins: [resolve()]
	},
	{
		input: "src/sharedworker-reflector.d.ts",
		output: [{ file: "dist/sharedworker-reflector.d.ts", format: "es" }],
		plugins: [dts(), resolve()],
	},
	{
		input: 'src/reflector-bc-ws-client.js',
		output: {
			file: 'dist/reflector-bc-ws-client.js',
			format: 'cjs'
		},
		// plugins: [resolve(), commonjs(), json()]
		plugins: [resolve()]
	}
];