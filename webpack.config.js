const path = require('path');
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    mode : "production",
    entry: './src/reflector-bc-ws-client.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'reflector-bc-ws-client.js',
    },
	plugins: [
		// https://stackoverflow.com/questions/55420795/copy-files-from-node-modules-to-dist-dir
		new CopyWebpackPlugin({
			patterns: [{
				from: 'src/sharedworker-reflector.js',
				to: 'sharedworker-reflector.es.js'
			}]
		})
	]
};