/*
 * natron-cli
 */
"use strict";

export { lookup };
import { resolve, dirname } from "path";
import { Module } from "module";
import { readFileSync } from "graceful-fs";
import assign from "object-assign";
import minimist from "minimist";

const NODE_MODULES = "node_modules";

const NATRON_MODULE_BIN = "natron/bin/natron";
const NATRON_MODULE_PKG = "natron/package";

const RC_FILE = ".natronrc";
const NF_FILE = "natronfile";

let findPath = Module._findPath;
// Module._extensions

function rcLookup(dir, rc) {
  let contents,
      rcFile = resolve(dir, RC_FILE);
  try {
    contents = readFileSync(rcFile);
  } catch (_) {
    return { rcFile: false, rc };
  }
  try {
    let json = JSON.parse(contents);
    if (rc) {
      json = assign(json, rc);
    }
    return { rcFile, rc: json };
  } catch (err) {
    throw new SyntaxError(err.message, rcFile);
  }
}

function nfLookup(dir, rc, rcDir) {
  let nfFile;
  try {
    if (rc && rcDir) {
      nfFile = require.resolve(resolve(rcDir, rc.natronfile || NF_FILE));
    } else {
      nfFile = require.resolve(resolve(dir, NF_FILE));
    }
  } catch (_) {
    if (rc) {
      throw new Error("Natronfile not found");
    }
    return { nfFile: false };
  }
  if (rc && rcDir) {
    let nfDir = dirname(nfFile);
    if (rcDir !== nfDir) {
      ({ rc } = rcLookup(nfDir, rc));
    }
  }
  return { nfFile, rc };
}

function localModuleLookup(paths) {
  let modulePath = findPath(NATRON_MODULE_BIN, paths);
  if (!modulePath) {
    throw new Error("Local Natron not found");
  }
  try {
    let pkgJson = require(findPath(NATRON_MODULE_PKG, paths));
    return { modulePath, pkgJson };
  } catch (_) {
    return { modulePath };
  }
}

function lookup(dir) {
  for (let pre, cur = resolve(dir); cur !== pre; [pre, cur] = [cur, dirname(cur)]) {
    let rcFile, nfFile, rc, modulePath;
    try {
      // Lookup .natronrc
      ({ rcFile, rc } = rcLookup(cur));
      // Lookup Natronfile
      ({ nfFile, rc } = nfLookup(cur, rc, rcFile && dirname(rcFile)));
      // Natronfile found
      if (nfFile) {
        let paths = [resolve(dirname(nfFile), NODE_MODULES)];
        if (rcFile) {
          paths.push(resolve(dirname(rcFile), NODE_MODULES));
        }
        // Lookup local Natron module
        ({ modulePath } = localModuleLookup(paths));
        return { nfFile, rc, modulePath };
      }
    } catch (err) {
      return { nfFile, rc, modulePath };
    }
  }
  return { nfFile: false };
}