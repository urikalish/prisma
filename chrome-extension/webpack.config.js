let path = require('path');
let webpack = require('webpack');
let htmlPlugin = require('html-webpack-plugin');
let Copy = require('./utils/copy_plugin');
let Exec = require('./utils/exec_plugin');

const BUILD_DIRECTORY = 'build';

const babelLoader = {
  test: /.js$/,
  include: path.join(__dirname, 'src'),
  loader: 'babel-loader',
  exclude: /node_modules/,
  options: {
    presets: ['es2015', 'env']
  }
};

const cssLoader = {
  test: /\.css$/,
  loaders: ['style', 'css']
};


module.exports = {
  entry: {
    content_script: path.join(__dirname, 'src', 'js', 'content_scripts', 'content_script.js'),
    background_script: path.join(__dirname, 'src', 'js', 'background_scripts', 'background_script.js'),
    // popup: path.join(__dirname, 'src', 'popup', 'popup-new', 'dist', 'main.js'),
    options_page: path.join(__dirname, 'src', 'options_page', 'js', 'options.js')
  },
  
  output: {
    path: path.join(__dirname, BUILD_DIRECTORY),
    publicPath: '/',
    filename: '[name].bundle.js'
  },
  
  module: {
    loaders: [babelLoader, cssLoader]
  },
  
  plugins: [
    new Copy({
      src: path.join(__dirname, 'src', 'popup', 'popup-new', 'dist'),
      dest: path.join(__dirname, 'build', 'popup'),
      type: 'folder'
    }),
    new Copy({
      src: path.join(__dirname, 'src', 'manifest.json'),
      dest: path.join(__dirname, 'build', 'manifest.json'),
      type: 'file'
    }),
    new Copy({
      src: path.join(__dirname, 'src', 'assets'),
      dest: path.join(__dirname, 'build', 'assets'),
      type: 'folder'
    }),
    new Exec({command: path.join(__dirname, 'src', 'popup', 'popup-new', 'build')}),
    
    // new htmlPlugin({
    //   template: path.join(__dirname, 'src', 'popup', 'popup-new', 'dist', 'index.html'),
    //   filename: 'popup.html',
    //   inject: 'body',
    //   chunks: ['popup']
    // }),
    
    new htmlPlugin({
      template: path.join(__dirname, 'src', 'options_page', 'options.html'),
      filename: 'options.html',
      inject: 'body',
      chunks: ['options_page']
    })
  ],
  
  stats: {
    colors: true
  },
  devtool: 'source-map',
  
  devServer: {
    inline: true,
    contentBase: [path.join(__dirname, 'src')],
    port: 3000
  }
};