/**
 * Created by bennun on 14/09/2017.
 */
let fs = require('file-system');

function CopyPlugin({src, dest, type}) {
  // Setup the plugin instance with options...
  this.src = src;
  this.dest = dest;
  this.type = type;
}

CopyPlugin.prototype.apply = function (compiler) {
  compiler.plugin('done', function () {
    console.log(`Copying files...`);
    
    switch (this.type) {
      case 'folder':
        fs.copySync(this.src, this.dest);
        
        break;
      
      case 'file':
      default:
        fs.copyFile(this.src, this.dest);
        
        break;
    }
    
  }.bind(this));
};

module.exports = CopyPlugin;