//WOOP
let fs = require("file-system");

function CopyPlugin({src, dest, type, failOnError = true}) {
  // Setup the plugin instance with options...
  this.src = src;
  this.dest = dest;
  this.type = type.toLowerCase();
  this.failOnError = failOnError;
}

CopyPlugin.prototype.apply = function (compiler) {
  compiler.plugin('done', function () {
    console.log(`WEBPACK::COPY_PLUGIN::Copying files...`);
    let copyFunc = this.type === 'file' ? fs.copyFile : fs.copySync;
    
    try {
      copyFunc(this.src, this.dest);
    } catch (e) {
      if (this.failOnError) {
        throw new Error(e);
      }
    }
  }.bind(this));
};

module.exports = CopyPlugin;