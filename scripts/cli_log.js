const clicolor = require("cli-color");

function timestamp() {
  const now = new Date();
  return (
    now.getFullYear() +
    "-" +
    String(now.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(now.getDate()).padStart(2, "0") +
    "|" +
    String(now.getHours()).padStart(2, "0") +
    ":" +
    String(now.getMinutes()).padStart(2, "0") +
    ":" +
    String(now.getSeconds()).padStart(2, "0")
  );
}
function err(data) {
  console.log(clicolor.red(clicolor.bold("[!] ") + data + ` - ${timestamp()}`));
}

function warn(data) {
  console.log(
    clicolor.yellow(clicolor.bold("[-] ") + data + ` - ${timestamp()}`)
  );
}

function log(data) {
  console.log(
    clicolor.white(clicolor.bold("[#] ") + data + ` - ${timestamp()}`)
  );
}

function yay(data) {
  console.log(
    clicolor.green(clicolor.bold("[+] ") + data + ` - ${timestamp()}`)
  );
}

module.exports = {
  err,
  warn,
  log,
  yay,
  rm: console.clear,
};
