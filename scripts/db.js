const sql3 = require("sqlite3");
const cli = require("./cli_log.js")
const path = require("path");
const db_config = require(path.join(__dirname,"../config/db.json"));

const db = new sql3.Database(db_config.filename,function(err){
    if(err != null) cli.err(err); else cli.log("Loaded Database")
process.exit()
});
function init_db() {
    db.run("CREATE TABLE users ( id INTEGER PRIMARY KEY, username TEXT, email TEXT, password TEXT, name TEXT, phone_number TEXT)")
}
