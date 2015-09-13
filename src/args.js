/*
 * natron-cli
 */
import minimist from "minimist";

export default (() => {
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
  return minimist(argv, {"--": true});
})();
