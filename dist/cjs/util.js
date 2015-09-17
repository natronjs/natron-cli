/*
 * natron-cli
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lookup = lookup;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _path = require("path");

var _module2 = require("module");

var _gracefulFs = require("graceful-fs");

var _objectAssign = require("object-assign");

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _minimist = require("minimist");

var _minimist2 = _interopRequireDefault(_minimist);

var NODE_MODULES = "node_modules";

var NATRON_MODULE_BIN = "natron/bin/natron";
var NATRON_MODULE_PKG = "natron/package";

var RC_FILE = ".natronrc";
var NF_FILE = "natronfile";

var findPath = _module2.Module._findPath;
// Module._extensions

function rcLookup(dir, rc) {
  var contents = undefined,
      rcFile = (0, _path.resolve)(dir, RC_FILE);
  try {
    contents = (0, _gracefulFs.readFileSync)(rcFile);
  } catch (_) {
    return { rcFile: false, rc: rc };
  }
  try {
    var json = JSON.parse(contents);
    if (rc) {
      json = (0, _objectAssign2["default"])(json, rc);
    }
    return { rcFile: rcFile, rc: json };
  } catch (err) {
    throw new SyntaxError(err.message, rcFile);
  }
}

function nfLookup(dir, rc, rcDir) {
  var nfFile = undefined;
  try {
    if (rc && rcDir) {
      nfFile = require.resolve((0, _path.resolve)(rcDir, rc.natronfile || NF_FILE));
    } else {
      nfFile = require.resolve((0, _path.resolve)(dir, NF_FILE));
    }
  } catch (_) {
    if (rc) {
      throw new Error("Natronfile not found");
    }
    return { nfFile: false };
  }
  if (rc && rcDir) {
    var nfDir = (0, _path.dirname)(nfFile);
    if (rcDir !== nfDir) {
      var _rcLookup = rcLookup(nfDir, rc);

      rc = _rcLookup.rc;
    }
  }
  return { nfFile: nfFile, rc: rc };
}

function localModuleLookup(paths) {
  var modulePath = findPath(NATRON_MODULE_BIN, paths);
  if (!modulePath) {
    throw new Error("Local Natron not found");
  }
  try {
    var pkgJson = require(findPath(NATRON_MODULE_PKG, paths));
    return { modulePath: modulePath, pkgJson: pkgJson };
  } catch (_) {
    return { modulePath: modulePath };
  }
}

function lookup(dir) {
  for (var pre = undefined, cur = (0, _path.resolve)(dir); cur !== pre; _ref = [cur, (0, _path.dirname)(cur)], pre = _ref[0], cur = _ref[1], _ref) {
    var _ref;

    var rcFile = undefined,
        nfFile = undefined,
        rc = undefined,
        modulePath = undefined;
    try {
      // Lookup Natronfile

      var _rcLookup2 = rcLookup(cur);

      // Lookup .natronrc
      rcFile = _rcLookup2.rcFile;
      rc = _rcLookup2.rc;

      // Natronfile found

      var _nfLookup = nfLookup(cur, rc, rcFile && (0, _path.dirname)(rcFile));

      nfFile = _nfLookup.nfFile;
      rc = _nfLookup.rc;
      if (nfFile) {
        var paths = [(0, _path.resolve)((0, _path.dirname)(nfFile), NODE_MODULES)];
        if (rcFile) {
          paths.push((0, _path.resolve)((0, _path.dirname)(rcFile), NODE_MODULES));
        }
        // Lookup local Natron module

        var _localModuleLookup = localModuleLookup(paths);

        modulePath = _localModuleLookup.modulePath;

        return { nfFile: nfFile, rc: rc, modulePath: modulePath };
      }
    } catch (err) {
      return { nfFile: nfFile, rc: rc, modulePath: modulePath };
    }
  }
  return { nfFile: false };
}