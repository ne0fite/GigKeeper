"use strict";

var fs = require("fs");

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

// export the config, prefering in order:
// - environment variables
// - config JSON
// - dev defaults
module.exports = {
    app: {
        env: process.env.NODE_ENV || configJson.app.env || "development",
        host: process.env.SERVER_HOST || configJson.app.host || "localhost",
        port: process.env.SERVER_PORT || configJson.app.port || 8000,
        cookie: {
            name: process.env.COOKIE_NAME || configJson.app.cookie.name || "gigkeeper-session",
            secret: process.env.COOKIE_SECRET || configJson.app.cookie.secret || "tempdevcookieneedstobecreated123"
        }
    },
    db: {
        host: process.env.DB_HOST || configJson.db.host || "localhost",
        port: process.env.DB_PORT || configJson.db.port || 3306,
        dialect: process.env.DB_DIALECT || configJson.db.dialect || "mysql",
        name: process.env.DB_NAME || configJson.db.name || "gigkeeper",
        user: process.env.DB_USER || configJson.db.user || "gigkeeper",
        pass: process.env.DB_PASS || configJson.db.pass || "gigkeeper"
    },
    google: {
        // no default for google API key!
        apiKey: process.env.GOOGLE_MAPS_API_KEY || configJson.google.apiKey
    }
};