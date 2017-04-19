var fs = require("fs");

// if provided, load the local config JSON
var configJson;
if (fs.existsSync(__dirname + "/config.json")) {
    configJson = require("./config.json");
} else {
    configJson = {
        db: {}
    };
}

module.exports = {
    development: {
        username: process.env.DB_USER || configJson.db.user || "gigkeeper",
        password: process.env.DB_PASS || configJson.db.pass || "gigkeeper",
        database: process.env.DB_NAME || configJson.db.name || "gigkeeper",
        host: process.env.DB_HOST || configJson.db.host || "localhost",
        port: process.env.DB_PORT || configJson.db.port || 3306,
        dialect: configJson.db.dialect || "mysql"
    },
    stage: {
        username: process.env.DB_USER || configJson.db.user || "gigkeeper",
        password: process.env.DB_PASS || configJson.db.pass || "gigkeeper",
        database: process.env.DB_NAME || configJson.db.name || "gigkeeper",
        host: process.env.DB_HOST || configJson.db.host || "localhost",
        port: process.env.DB_PORT || configJson.db.port || 3306,
        dialect: configJson.db.dialect || "mysql"
    },
    production: {
        username: process.env.DB_USER || configJson.db.user || "gigkeeper",
        password: process.env.DB_PASS || configJson.db.pass || "gigkeeper",
        database: process.env.DB_NAME || configJson.db.name || "gigkeeper",
        host: process.env.DB_HOST || configJson.db.host || "localhost",
        port: process.env.DB_PORT || configJson.db.port || 3306,
        dialect: configJson.db.dialect || "mysql"
    }
};