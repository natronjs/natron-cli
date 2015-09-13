/*
 * natron-cli
 */
"use strict";

export { main };
import { fork } from "child_process";
import { lookup } from "./util";

function main(args) {
  if (args && args["--"] && args["--"].length) {
    let { nfFile, rc, modulePath } = lookup(process.cwd());
    if (!nfFile) {
      console.error("Natronfile not found");
      return;
    }

    rc = rc || {};
    let flags = Object.getOwnPropertyNames(args).filter(p => {
      return p !== "_" && p !== "--";
    });
    if (flags.length) {
      rc.flags = rc.flags || {};
      for (let prop of flags) {
        rc.flags[prop] = args[prop];
      }
    }
    try {
      process.env.NATRON_RC = JSON.stringify(rc);
    } catch (_) {}

    if (modulePath) {
      // Run local Natron module
      let child = fork(modulePath, [nfFile, ...args["--"]]);
    } else {
      console.error("Local Natron module not found");
    }
  } else {
    console.error("No arguments");
  }
}