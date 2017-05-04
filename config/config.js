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
configJson.api = configJson.api || {};
configJson.api.jwt = configJson.api.jwt || {};
configJson.db = configJson.db || {};
configJson.smtp = configJson.smtp || {};
configJson.google = configJson.google || {};

var env = process.env.NODE_ENV || configJson.env || "development";

/**
 * Build up a base URL for the environment.
 *
 * @param {string} protocol "http" or "https"
 * @param {string} host The server's hostname or IP
 * @param {number} port The server's external port number
 *
 * @return {string}
 */
function buildBaseUrl(protocol, host, port) {
    const portSuffix = [80, 443].indexOf(port) != -1 ? "" : ":" + port;

    return protocol + "://" + host + portSuffix;
}

// export the config, prefering in order:
// - environment variables
// - config JSON
// - dev defaults
var config = module.exports = {
    env: env,
    app: {
        protocol: process.env.UI_PROTOCOL || configJson.app.protocol || "http",
        host: process.env.UI_HOST || configJson.app.host || "localhost",
        port: process.env.UI_PORT || configJson.app.port || 8001
    },
    api: {
        protocol: process.env.SERVER_PROTOCOL || configJson.api.protocol || "http",
        host: process.env.SERVER_HOST || configJson.api.host || "localhost",
        port: process.env.SERVER_PORT || configJson.api.port || 8000,
        externalPort: process.env.SERVER_EXTERNAL_PORT || configJson.api.externalPort || 8000,
        jwt: {
            secret: process.env.JWT_SECRET || configJson.api.jwt.secret || "NeverShareYourSecret"
        }
    },
    db: {
        host: dbconfig[env].host,
        port: dbconfig[env].port,
        dialect: dbconfig[env].dialect,
        name: dbconfig[env].database,
        user: dbconfig[env].username,
        pass: dbconfig[env].password,
        logging: dbconfig[env].logging
    },
    smtp: {
        enabled: process.env.SMTP_ENABLED == "true" || configJson.smtp.enabled || false,
        fromAddress: process.env.SMTP_FROM_ADDRESS || configJson.smtp.fromAddress || null,
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

config.app.baseUrl = buildBaseUrl(config.app.protocol, config.app.host, config.app.port);
config.api.baseUrl = buildBaseUrl(config.api.protocol, config.api.host, config.api.externalPort);