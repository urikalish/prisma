let path = require('path');
let webpack = require('webpack');
let Copy = require('webpack-common-utils').CopyPlugin;
let Exec = require('webpack-common-utils').ExecPlugin;
let Delete = require('webpack-common-utils').DeletePlugin;
let ReinstallModule = require('webpack-common-utils').YarnRemoveModuleAndReinstallAll;

const BUILD_DIRECTORY = 'build';

const PACKAGE_MANAGER = 'yarn';
const PKG_MNG_INSTALL = `${PACKAGE_MANAGER} install`;
const PKG_MNG_BUILD = `${PACKAGE_MANAGER} build`;

const babelLoader = {
  test: /.js$/,
  include: path.join(__dirname, 'src'),
  loader: 'babel-loader',
  exclude: /node_modules/,
  options: {
    presets: ['@babel/preset-env']
  }
};

module.exports = {
  entry: {
    content_script: path.join(__dirname, 'src', 'js', 'content_scripts', 'content_script.js'),
    "injected-to-aut-scope": path.join(__dirname, 'src', 'js', 'content_scripts', 'injected-to-aut-scope.js')
  },
  
  output: {
    path: path.join(__dirname, BUILD_DIRECTORY),
    publicPath: '/',
    filename: '[name].bundle.js'
  },
  
  module: {
    loaders: [babelLoader]
  },
  
  plugins: [
    // Remove old build folder (And don't fail if folders are not found)
    new Delete({
      path: path.join(__dirname, BUILD_DIRECTORY),
      failOnError: false
    }),
    
    // COPY & assemble PRiSM extension to `BUILD_DIRECTORY`
    new Copy({
      src: path.join(__dirname, 'src', 'extension', 'dist'),
      dest: path.join(__dirname, BUILD_DIRECTORY, 'extension'),
      type: 'folder'
    }),
    new Copy({
      src: path.join(__dirname, 'src', 'manifest.json'),
      dest: path.join(__dirname, BUILD_DIRECTORY, 'manifest.json'),
      type: 'file'
    }),
    new Copy({
      src: path.join(__dirname, 'src', 'prism.config'),
      dest: path.join(__dirname, BUILD_DIRECTORY, 'prism.config'),
      type: 'file'
    }),
    new Copy({
      src: path.join(__dirname, 'src', 'assets'),
      dest: path.join(__dirname, BUILD_DIRECTORY, 'assets'),
      type: 'folder'
    }),
    // new Copy({
    //   src: path.join(__dirname, '..', 'agent', 'lib', 'prism-agent.min.js'),
    //   dest: path.join(__dirname, BUILD_DIRECTORY, 'prism-purejs-agent.min.js'),
    //   type: 'file'
    // }),
    new Copy({
      src: path.join(__dirname, 'src', 'js', 'content_scripts', 'content-script-octane.js'),
      dest: path.join(__dirname, BUILD_DIRECTORY, 'content-script-octane.js'),
      type: 'file'
    }),
    new Copy({
      src: path.join(__dirname, 'src', 'js', 'content_scripts', 'aut-js-injector.js'),
      dest: path.join(__dirname, BUILD_DIRECTORY, 'aut-js-injector.js'),
      type: 'file'
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