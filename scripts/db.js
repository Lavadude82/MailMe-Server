const cli = require("./cli_log.js");
const path = require("path");
const bcrypt = require("bcrypt");
const db_config = require(path.join(__dirname, "../config/db.json"));
const user_defaults_config = require(path.join(
  __dirname,
  "../config/user_defaults.json"
));
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

  let memory_db = fs.readFileSync(
    path.join(__dirname, "../data/", `${db_config.basename}0.odb`)
  );

  if (memory_db == "") {
    fs.writeFileSync(
      path.join(__dirname, "../data/", `${db_config.basename}0.odb`),
      JSON.stringify({ users: [], mail: [] })
    );
    cli.yay("Database Data Initialized!");

    memory_db = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, "../data/", `${db_config.basename}0.odb`),
        "utf-8"
      )
    );
    cli.yay("Database Loaded");
  } else {
    memory_db = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, "../data/", `${db_config.basename}0.odb`),
        "utf-8"
      )
    );
    cli.yay("Database Loaded");
  }

  function save() {
    fs.writeFileSync(
      path.join(__dirname, "../data/", `${db_config.basename}0.odb`),
      JSON.stringify(memory_db)
    );
    if (db_config.db_log) cli.log("Database Saved");
  }

  function createUser(email, password, username, name, pfp) {
    let userid = memory_db.users.find((user) => {
      return user.email === email;
    });

    if (userid == undefined) {
      userid = memory_db.users.find((user) => {
        return user.username === username;
      });
    }
    if (userid != undefined) {
      if (db_config.db_log) cli.log("User Creation Failed");
      return {
        status: 400,
        error: { message: "Username or Email in Use", web_code: 1 },
      };
    }

    let contains_digit = /\d/.test(password);
    let contains_space = /\s/.test(password);
    let contains_symbol = /[^a-zA-Z0-9\s]/.test(password);
    if (
      (password.length >= user_defaults_config.password.length.min &&
        password.length <= user_defaults_config.password.length.max &&
        contains_space) ||
      !contains_digit ||
      !contains_symbol
    ) {
      if (db_config.db_log) cli.log("User Creation Failed");
      return {
        status: 400,
        error: {
          message:
            "Password Doesn't Meet Neccesary Criteria or Contains Illegal Characters",
          web_code: 7,
          sub_code: contains_space
            ? 4
            : !contains_digit
            ? 3
            : !contains_symbol
            ? 2
            : 0,
        },
      };
    }
    if (pfp === undefined) {
      pfp =
        "data:image/png;base64," +
        fs
          .readFileSync(
            path.join(
              __dirname,
              "../resources/db_defaults",
              user_defaults_config.default_pfp
            )
          )
          .toString("base64");
    }
    let pw = bcrypt.hashSync(password, 10);
    let t = btoa(bcrypt.hashSync(pw + email + username, 5));
    memory_db.users.push({
      username: username,
      email: email,
      password: pw,
      name: name,
      token: t,
      pfp: pfp,
    });
    if (db_config.db_log) cli.log("User Creation Succesful");
    return {
      status: 200,
      success: { message: "Succesfully Created Account!", web_code: 4 },
      data: { token: t },
    };
  }

  function deleteUser(email, password, token) {
    let db_user = memory_db.users.find((user) => {
      return user.email === email;
    });
    if (db_user == undefined) {
      if (db_config.db_log) {
        cli.log("User Removal Failed");
      }
       return {
        status: 400,
        error: { message: "Account Doesn't Exist", web_code: 67 },
      };;
    }
    if (
      bcrypt.compareSync(password, db_user.password) &&
      token === db_user.token
    ) {
      let userid = memory_db.users.findIndex((user) => {
        return user.email === email;
      });
      memory_db.users.splice(userid, 1);
      if (db_config.db_log) cli.log("User Removal Succesful");
      return;
    }
    if (db_config.db_log) cli.log("User Creation Failed");
  }

  function loginUser(username, password) {
    let db_user = memory_db.users.find((user) => {
      return user.username === username;
    });
    if (db_user == undefined) {
      if (db_config.db_log) cli.log("User login Failed");
      return {
        status: 400,
        error: { message: "Account Doesn't Exist", web_code: 4 },
      };
    }
    if (
      bcrypt.compareSync(password, db_user.password) &&
      db_user.email == email
    ) {
      return {
        status: 200,
        success: { message: "Account Login Succesful", web_code: 2 },
        data: { token: db_user.token, pfp: db_user.pfp },
      };
    }
  }

  function fetchUser(token) {
    let db_user = memory_db.users.find((user) => {
      return user.token === token;
    });
    if (db_user == undefined) {
      if (db_config.db_log) cli.log("User Fetch Failed");
      return {
        status: 400,
        error: { message: "Account Doesn't Exist", web_code: 4 },
      };
    }

    return {
      status: 200,
      success: { message: "User Fetch Succesful", web_code: 9 },
      data: { username: db_user.username },
    };
  }
  return { save, createUser, deleteUser, loginUser, fetchUser };
}

module.exports = {
  init_db,
};
