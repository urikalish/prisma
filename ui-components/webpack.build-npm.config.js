let path = require('path');
let webpack = require('webpack');
let Copy = require('webpack-common-utils').CopyPlugin;
let Exec = require('webpack-common-utils').ExecPlugin;
let Delete = require('webpack-common-utils').DeletePlugin;

const BUILD_DIRECTORY = 'lib';

const PACKAGE_MANAGER = 'yarn';
const PKG_MNG_INSTALL = `${PACKAGE_MANAGER} install`;
const PKG_MNG_BUILD = `${PACKAGE_MANAGER} build-npm-pkg`;

module.exports = {
  entry: {
    index: path.join(__dirname, 'empty-entry.js'),
  },
  
  output: {
    path: path.join(__dirname, 'temp'),
    publicPath: '/',
    filename: '[name].bundle.js'
  },
  plugins: [
    // Remove old build folder (And don't fail if folders are not found)
    new Delete({
      path: path.join(__dirname, BUILD_DIRECTORY),
      failOnError: false
    }),
    
    // BUILD Angular extension project
    new Exec({
      command: PKG_MNG_INSTALL,
      path: path.join(__dirname)
    }),
    new Exec({
      command: `${PKG_MNG_BUILD}`,
      path: path.join(__dirname)
    }),
    // new Exec({
    //   command: `${PACKAGE_MANAGER} ng build --dev`,
    //   path: path.join(__dirname, 'src', 'extension')
    // }),
    
    // COPY assets to `BUILD_DIRECTORY`
    new Copy({
      src: path.join(__dirname, 'src', 'assets'),
      dest: path.join(__dirname, BUILD_DIRECTORY, 'assets'),
      type: 'folder'
    }),
    new Copy({
      src: path.join(__dirname, 'src', 'global-styles'),
      dest: path.join(__dirname, BUILD_DIRECTORY, 'global-styles'),
      type: 'folder'
    })
  ],
  
  stats: {
    colors: true
  },
  devtool: 'source-map'
};
