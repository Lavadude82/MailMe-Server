const cli = require("./cli_log.js");
const path = require("path");
const db_config = require(path.join(__dirname, "../config/db.json"));
const fs = require("fs");

function init_db() {
  cli.log(`Looking for Exisitng Database |Basename:${db_config.basename}|`);
  const files = fs.readdirSync(path.join(__dirname, "../data"));
  const db_files = files.filter((file) => {
    return file.startsWith(db_config.basename) && file.endsWith(".odb");
  });
  if (db_files.length === 0) {
    cli.warn("No Databse Found");
    cli.log(`Creating New Databse |Basename:${db_config.basename}|`);
    fs.writeFileSync(
      path.join(__dirname, "../data/", `${db_config.basename}0.odb`),
      ""
    );
  } else {
    cli.yay(`Database Found |Basename:${db_config.basename}|`);
  }
}

module.exports = {
  init_db,
};
