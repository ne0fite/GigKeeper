"use strict";

var Hapi = require("hapi");
var Inert = require("inert");
var Sequelize = require("sequelize");
var HapiCookie = require("hapi-auth-cookie");

// server settings
var config = require("./config/config.json");

// var bcrypt = require("bcrypt");
// var salt = bcrypt.genSaltSync(10);
// console.log(salt);
// console.log(bcrypt.hashSync("password", salt));

// Create a server with a host and port
var server = new Hapi.Server();
server.connection({
    host: config.app.host,
    port: config.app.port
});

var sequelize = new Sequelize(config.db.name, config.db.user, config.db.pass, {
    dialect: config.db.dialect,
    host: config.db.host,
    port: config.db.port
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
            googleApiKey: config.google.apiKey
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
        cookie: config.app.cookie.name,
        password: config.app.cookie.secret,
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