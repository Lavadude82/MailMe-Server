//Import Ncessary Modules

const express = require("express");
const { body } = require("express-validator");
const fs = require("fs");
const https = require("https");
const path = require("path");
const cli = require(path.join(__dirname, "scripts/cli_log.js"));
const db_wrapper = require(path.join(__dirname, "scripts/db.js"));

cli.rm();
cli.log("Loading HTTPS & Certificate Configuration");

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
//init db
const db = db_wrapper.init_db();
db.createUser("example@gmail.com", "temporary", "singer", "Lavadude82");
db.save();
//Setup Server
const app = express();

app.post(
  "/user/create",
  body("username").isBase64(),
  body("name").isBase64(),
  body("email").isBase64(),
  body("password").isBase64(),
  body("pfp"),
  function (req, res) {
    const results = db.createUser(
      btoa(req.body.email),
      btoa(req.body.password),
      btoa(req.body.username),
      req.body.pfp
    );
  }
);
app.post("/user/delete", function (req, res) {});
app.post("/user/fetch", function (req, res) {});
app.post("/user/login", function (req, res) {});

app.post("/mail", function (req, res) {});

//Start Server
app.listen(http_conf.port, function () {
  cli.yay(`HTTP Server Listening |Port:${http_conf.port}|`);
});
