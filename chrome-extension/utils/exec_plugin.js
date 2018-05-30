/**
 * Created by bennun on 14/09/2017.
 */
const execSync = require('child_process').execSync;

function ExecPlugin({command}) {
  // Setup the plugin instance with options...
  this.command = command;
}

ExecPlugin.prototype.apply = function (compiler) {
  compiler.plugin('compile', function () {
    console.log(`Executing ${this.command}...`);
    execSync(this.command);
  }.bind(this));
};

module.exports = ExecPlugin;