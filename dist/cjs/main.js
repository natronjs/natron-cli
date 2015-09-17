/*
 * natron-cli
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.main = main;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _child_process = require("child_process");

var _util = require("./util");

var _package = require("../package");

var _package2 = _interopRequireDefault(_package);

var _objectAssign = require("object-assign");

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _minimist = require("minimist");

var _minimist2 = _interopRequireDefault(_minimist);

function main() {
  var args = arguments.length <= 0 || arguments[0] === undefined ? main.args : arguments[0];

  if (args["version"]) {
    console.log("Natron CLI", "v" + _package2["default"].version);
    return;
  }
  if (args && args["--"]) {
    var _lookup = (0, _util.lookup)(process.cwd());

    var nfFile = _lookup.nfFile;
    var rc = _lookup.rc;
    var modulePath = _lookup.modulePath;

    if (!nfFile) {
      console.error("Natronfile not found");
      return;
    }

    rc = rc || {};
    var flags = Object.getOwnPropertyNames(args).filter(function (p) {
      return p !== "_" && p !== "--";
    });
    if (flags.length) {
      rc.flags = rc.flags || {};
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = flags[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var prop = _step.value;

          rc.flags[prop] = args[prop];
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"]) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
    try {
      process.env.NATRON_RC = JSON.stringify(rc);
    } catch (_) {}

    if (modulePath) {
      // Run local Natron module
      var child = (0, _child_process.fork)(modulePath, [nfFile].concat(_toConsumableArray(args["--"])));
    } else {
      console.error("Local Natron module not found");
    }
  }
}

main.args = (function () {
  var options = {
    "boolean": ["debug", "global", "help", "version"],
    "string": ["natronfile"],
    "alias": {
      "d": "debug",
      "g": "global",
      "h": "help",
      "n": "natronfile",
      "v": "version"
    }
  };
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
  return (0, _minimist2["default"])(argv, (0, _objectAssign2["default"])(options, { "--": true }));
})();