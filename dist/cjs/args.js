/*
 * natron-cli
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _minimist = require("minimist");

var _minimist2 = _interopRequireDefault(_minimist);

exports["default"] = (function () {
  var argv = [];
  for (var i = 2; i < process.argv.length; i++) {
    var arg = process.argv[i];
    if (!argv.stop) {
      if (arg.charAt(0) !== "-") {
        argv.push("--");
        argv.stop = true;
      } else if (arg === "--") {
        argv.stop = true;
      }
    }
    argv.push(arg);
  }
  return (0, _minimist2["default"])(argv, { "--": true });
})();

module.exports = exports["default"];