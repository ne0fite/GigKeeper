"use strict";

var fs = require("fs");
var dbconfig = require("./dbconfig.js");

// if provided, load the local config JSON
var configJson;
if (fs.existsSync(__dirname + "/config.json")) {
    configJson = require("./config.json");
} else {
    configJson = {};
}

// create missing properties
configJson.app = configJson.app || {};
configJson.app.cookie = configJson.app.cookie || {};
configJson.db = configJson.db || {};
configJson.google = configJson.google || {};

var env = process.env.NODE_ENV || configJson.app.env || "development";

// export the config, prefering in order:
// - environment variables
// - config JSON
// - dev defaults
module.exports = {
    app: {
        env: env,
        host: process.env.SERVER_HOST || configJson.app.host || "localhost",
        port: process.env.SERVER_PORT || configJson.app.port || 8000,
        cookie: {
            name: process.env.COOKIE_NAME || configJson.app.cookie.name || "gigkeeper-session",
            secret: process.env.COOKIE_SECRET || configJson.app.cookie.secret || "tempdevcookieneedstobecreated123"
        }
    },
    db: {
        host: dbconfig[env].host,
        port: dbconfig[env].port,
        dialect: dbconfig[env].dialect,
        name: dbconfig[env].database,
        user: dbconfig[env].username,
        pass: dbconfig[env].password
    },
    google: {
        // no default for google API key!
        apiKey: process.env.GOOGLE_MAPS_API_KEY || configJson.google.apiKey
    }
};