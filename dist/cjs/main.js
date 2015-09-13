/*
 * natron-cli
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.main = main;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _child_process = require("child_process");

var _util = require("./util");

function main(args) {
  if (args && args["--"] && args["--"].length) {
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
  } else {
    console.error("No arguments");
  }
}