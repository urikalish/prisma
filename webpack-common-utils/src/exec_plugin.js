const execSync = require("child_process").execSync;

function ExecPlugin({command, path, failOnError = true}) {
  // Setup the plugin instance with options...
  this.command = command;
  this.path = path;
  this.failOnError = failOnError;
}

ExecPlugin.prototype.apply = function (compiler) {
  compiler.plugin('compile', function () {
    console.info('WEBPACK::EXECUTION_PLUGIN::Executing: ', this.command);
    try {
      execSync(`${this.command}`, {cwd: this.path, stdio: 'inherit'});
    } catch (e) {
      if (this.failOnError) {
        throw new Error(e);
      }
    }
  }.bind(this));
};

module.exports = ExecPlugin;