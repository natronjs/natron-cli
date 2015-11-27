/**
 * @module natron-cli
 */
import {fork} from "child_process";
import {lookup} from "./util";
import pkgJson from "../package";
import minimist from "minimist";

export function main(args = main.args): void {
  if (args["version"]) {
    console.log("Natron CLI", `v${pkgJson.version}`);
    return;
  }
  if (args && args["--"]) {
    let {nfFile, rc, modulePath} = lookup(process.cwd());
    if (!nfFile) {
      console.error("Natronfile not found");
      return;
    }

    rc = rc || {};
    let flags = Object.getOwnPropertyNames(args).filter((p) => {
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
    } catch (_) { /* ... */ }

    if (modulePath) {
      // Run local Natron module
      let child = fork(modulePath, [nfFile, ...args["--"]]);
    } else {
      console.error("Local Natron module not found");
    }
  }
}

main.args = (() => {
  let options = {
    "boolean": [
      "debug",
      "global",
      "help",
      "version",
    ],
    "string": [
      "natronfile",
    ],
    "alias": {
      "d": "debug",
      "g": "global",
      "h": "help",
      "n": "natronfile",
      "v": "version",
    },
  };
  let argv = [];
  for (let i = 2; i < process.argv.length; i++) {
    let arg = process.argv[i];
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
  return minimist(argv, Object.assign(options, {"--": true}));
})();
