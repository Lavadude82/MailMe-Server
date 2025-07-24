//Import Ncessary Modules

const express = require("express");
const fs = require("fs");
const https = require("https");
const path = require("path");
const cli = require(path.join(__dirname, "scripts/cli_log.js"));

cli.clear();
cli.log("Loading Configuration");

//Import Config
const http_conf = require(path.join(__dirname, "./config/http.json"));
const cert_conf = require(path.join(__dirname, "./config/certs.json"));

//Check if certificates available

/*
cli.log("Checking for Certificates")
let certificates_available = false;
try{
    fs.existSync()
}catch{

}
*/

//Setup Server
const app = express();

app.post("/mail",function(req,res){

})


//Start Server
app.listen(http_conf.port, function () {
  cli.log(`HTTP Server Listening |Port:${http_conf.port}|`);
});
