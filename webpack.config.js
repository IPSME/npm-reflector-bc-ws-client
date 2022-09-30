const path = require('path');

module.exports = {
    mode : "production",
    entry: './src/reflector-bc-ws-client.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'reflector-bc-ws-client.js',
    },
};