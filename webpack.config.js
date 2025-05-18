const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/server.js', // Your Express entry point
  target: 'node',           // So webpack knows it's a Node.js app
  externals: [nodeExternals()], // Do not bundle node_modules
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'server.bundle.js',
  },
  mode: 'production', // Or 'development' for testing
};
