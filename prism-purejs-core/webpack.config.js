let path = require('path');
let webpack = require('webpack');
let htmlPlugin = require('html-webpack-plugin');

const BUILD_DIRECTORY = 'lib';
const BUILD_VERSION = JSON.stringify(require('./package.json').version);
const API_MOCKUP = true;

const babelLoader = {
  test: /\.js$/,
  include: path.join(__dirname, 'src'),
  loader: 'babel-loader',
  exclude: /node_modules/
};

const rawLoader = {
  test: /\.(html||css)$/,
  include: path.join(__dirname, 'src'),
  loader: 'raw-loader',
  exclude: /node_modules/
};

const testEnv = {
  entry: {
    // index: path.join(__dirname, 'src', 'index.js'),
    test: ["whatwg-fetch", "babel-polyfill", path.join(__dirname, 'src', 'test.js')]
  },
  
  output: {
    path: path.join(__dirname, BUILD_DIRECTORY),
    filename: '[name].js',
    publicPath: '/'
  },
  
  module: {
    loaders: [babelLoader, rawLoader]
  },
  
  plugins: [
    new webpack.DefinePlugin({
      __VERSION__: BUILD_VERSION,
      __API_MOCKUP__: API_MOCKUP
    }),
    new htmlPlugin({
      template: path.join(__dirname, 'src', 'index.html'),
      filename: 'index.html',
      inject: 'body',
      chunks: ['test']
    })
  ],
  
  stats: {
    colors: true
  },
  devtool: 'source-map',
  devServer: {
    inline: true,
    contentBase: [path.join(__dirname, 'src')],
    port: 3000,
    // public: 'devenv.hpeswlab.net:3000'
    public: 'devenv.saas.hpe.com:3000'
    // https: true
  }
};

module.exports = testEnv;