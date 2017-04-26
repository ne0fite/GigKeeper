/**
 * @license
 * Copyright (C) 2017 Phoenix Bright Software, LLC
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

"use strict";

var Hapi = require("hapi");
var Inert = require("inert");
var Sequelize = require("sequelize");
var HapiCookie = require("hapi-auth-cookie");

// server settings
var config = require("./config/config.js");

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
    require("./server/plugins/userPlugin"),
    require("./server/plugins/mapPlugin")
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