let path = require('path');
let webpack = require('webpack');

const BUILD_DIRECTORY = 'lib';
const LIBRARY_NAME = 'prism-purejs-agent';
const BUILD_VERSION = JSON.stringify(require('./package.json').version);
const API_MOCKUP = true;

const babelLoader = {
  test: /.js$/,
  include: path.join(__dirname, 'src'),
  loader: 'babel-loader',
  exclude: /node_modules/
};

const buildPackage = {
  entry: {
    index: path.join(__dirname, 'src', 'agentTest.js')
  },
  
  output: {
    path: path.join(__dirname, BUILD_DIRECTORY),
    filename: LIBRARY_NAME + '.min.js',
    publicPath: '/'
  },
  
  plugins: [
    new webpack.DefinePlugin({
      __VERSION__: BUILD_VERSION,
      __API_MOCKUP__: API_MOCKUP
    }),
    new webpack.optimize.UglifyJsPlugin()
  ],
  
  module: {
    loaders: [babelLoader]
  }
};

module.exports = buildPackage;