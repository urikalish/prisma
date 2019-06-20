/**
 * Created by bennun on 14/09/2017.
 *
 */
let fs = require("file-system");
const execSync = require("child_process").execSync;
const path = require("path");

const PACKAGE_MANAGER = 'yarn';
const PKG_MNG_CLEAR = `${PACKAGE_MANAGER} cache clean`;
const PKG_MNG_INSTALL = `${PACKAGE_MANAGER} install --check-files`;

function YarnRemoveModuleAndReinstallAll({local_package, path, failOnError = true}) {
  // Setup the plugin instance with options...
  this.package = local_package;
  this.path = path;
  this.failOnError = failOnError;
}

YarnRemoveModuleAndReinstallAll.prototype.apply = function (compiler) {
  compiler.plugin('compile', function () {
    console.info('WEBPACK::YARN_REINSTALL_PLUGIN::reinstalling: ', this.package);
    try {
      fs.rmdirSync(path.join(this.path, 'node_modules', this.package));
    } catch (e) {
    
    }
    
    
    try {
      execSync(`${PKG_MNG_CLEAR} ${this.package}`, {cwd: this.path, stdio: 'inherit'});
      execSync(`${PKG_MNG_INSTALL}`, {cwd: this.path, stdio: 'inherit'});
      // addModule({project_path: this.path, module_name: this.package});
    } catch (e) {
      if (this.failOnError) {
        throw new Error(e);
      }
    }
  }.bind(this));
};

module.exports = YarnRemoveModuleAndReinstallAll;