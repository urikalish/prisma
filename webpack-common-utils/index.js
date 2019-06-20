let CopyPlugin = require("./src/copy_plugin");
let DeletePlugin = require("./src/delete_plugin");
let ExecPlugin = require("./src/exec_plugin");
let YarnRemoveModuleAndReinstallAll = require("./src/yarn_reinstall_plugin");

module.exports = {
  CopyPlugin,
  DeletePlugin,
  ExecPlugin,
  YarnRemoveModuleAndReinstallAll
};