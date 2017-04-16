"use strict";

var Hapi = require("hapi");
var Inert = require("inert");
var Sequelize = require("sequelize");
var HapiCookie = require("hapi-auth-cookie");

// server settings
// TODO: export to env, overwritten by config JSON
var webHost = "localhost";
var webPort = 8000;
var dbHost = "localhost";
var dbPort = 3306;
var dbDialect = "mysql";
var dbUser = "root";
var dbPass = "root";
var dbName = "gigkeeper";
var cookieName = "gigkeeper-session";
var cookieSecret = "dd3ac595261591d8a855fd13a5d511fb";
var googleApiKey = "AIzaSyBNbgD_hQFLD93gpL9dQcrz7-s91vxl-H8";

// var bcrypt = require("bcrypt");
// var salt = bcrypt.genSaltSync(10);
// console.log(salt);
// console.log(bcrypt.hashSync("password", salt));

// Create a server with a host and port
var server = new Hapi.Server();
server.connection({
    host: webHost,
    port: webPort
});

var sequelize = new Sequelize(dbName, dbUser, dbPass, {
    dialect: dbDialect,
    host: dbHost,
    port: dbPort
});

server.register([
    Inert,
    HapiCookie,
    {
        register: require("hapi-sequelize"),
        options: [{
            name: "gigkeeperdb", // identifier
            models: ["./server/models/**/*.js"], // paths/globs to model files
            sequelize: sequelize,
            sync: false,
            forceSync: false
        }]
    },
    require("./server/plugins/contractorPlugin"),
    {
        register: require("./server/plugins/gigPlugin"),
        options: {
            googleApiKey: googleApiKey
        }
    },
    require("./server/plugins/profilePlugin"),
    require("./server/plugins/publicPlugin"),
    require("./server/plugins/securityPlugin"),
    require("./server/plugins/settingsPlugin"),
    require("./server/plugins/tagPlugin"),
    require("./server/plugins/userPlugin")
], function(err) {

    if (err) {
        throw err;
    }

    server.auth.strategy("base", "cookie", {
        cookie: cookieName,
        password: cookieSecret,
        ttl: 24 * 60 * 60 * 1000,
        isSecure: false
    });

    server.auth.default({
        strategy: "base"
    });

    // Start the server
    server.start(function(err) {

        if (err) {
            throw err;
        }

        console.log("Server running at:", server.info.uri); // eslint-disable-line no-console
    });
});

module.exports = server;