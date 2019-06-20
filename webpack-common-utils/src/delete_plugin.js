let fs = require("file-system");

function DeletePlugin({path, failOnError = true}) {
  // Setup the plugin instance with options...
  this.path = path;
  this.failOnError = failOnError;
}

DeletePlugin.prototype.apply = function (compiler) {
  compiler.plugin('compile', () => {
    console.log(`WEBPACK::DELETE_PLUGIN::Deleting files...`);
    
    try {
      fs.rmdirSync(this.path);
    } catch (e) {
      if (this.failOnError) {
        throw new Error(e);
      }
    }
  });
};

module.exports = DeletePlugin;