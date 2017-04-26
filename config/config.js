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
configJson.smtp = configJson.smtp || {};
configJson.google = configJson.google || {};

var env = process.env.NODE_ENV || configJson.app.env || "development";

// export the config, prefering in order:
// - environment variables
// - config JSON
// - dev defaults
module.exports = {
    app: {
        env: env,
        baseUrl: process.env.BASE_URL || configJson.app.baseUrl || "http://localhost:8000",
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
    smtp: {
        enabled: process.env.SMTP_ENABLED || configJson.smtp.enabled || false,
        singleAddress: process.env.SMTP_SINGLE_ADDRESS || configJson.smtp.singleAddress || null,
        service: process.env.SMTP_SERVICE || configJson.smtp.service || "gmail",
        user: process.env.SMTP_USER || configJson.smtp.user,
        pass: process.env.SMTP_PASS || configJson.smtp.pass
    },
    google: {
        // no default for google API key!
        apiKey: process.env.GOOGLE_MAPS_API_KEY || configJson.google.apiKey
    }
};