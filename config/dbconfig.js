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

var fs = require("fs");

// if provided, load the local config JSON
var configJson;
if (fs.existsSync(__dirname + "/config.json")) {
    configJson = require("./config.json");
    if (!configJson.db) {
        configJson.db = {
            logging: false
        };
    }
} else {
    configJson = {
        db: {
            logging: false
        }
    };
}

module.exports = {
    development: {
        username: process.env.DB_USER || configJson.db.user || "gigkeeper",
        password: process.env.DB_PASS || configJson.db.pass || "gigkeeper",
        database: process.env.DB_NAME || configJson.db.name || "gigkeeper",
        host: process.env.DB_HOST || configJson.db.host || "localhost",
        port: process.env.DB_PORT || configJson.db.port || 5432,
        dialect: process.env.DB_DIALECT || configJson.db.dialect || "postgres",
        logging: process.env.DB_LOGGING || configJson.db.logging
    },
    stage: {
        username: process.env.DB_USER || configJson.db.user || "gigkeeper",
        password: process.env.DB_PASS || configJson.db.pass || "gigkeeper",
        database: process.env.DB_NAME || configJson.db.name || "gigkeeper",
        host: process.env.DB_HOST || configJson.db.host || "localhost",
        port: process.env.DB_PORT || configJson.db.port || 5432,
        dialect: process.env.DB_DIALECT || configJson.db.dialect || "postgres",
        logging: process.env.DB_LOGGING || configJson.db.logging
    },
    production: {
        username: process.env.DB_USER || configJson.db.user || "gigkeeper",
        password: process.env.DB_PASS || configJson.db.pass || "gigkeeper",
        database: process.env.DB_NAME || configJson.db.name || "gigkeeper",
        host: process.env.DB_HOST || configJson.db.host || "localhost",
        port: process.env.DB_PORT || configJson.db.port || 5432,
        dialect: process.env.DB_DIALECT || configJson.db.dialect || "postgres",
        logging: process.env.DB_LOGGING || configJson.db.logging
    }
};