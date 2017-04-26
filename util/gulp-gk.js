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

var sqlizr = require("sqlizr");
var Sequelize = require("sequelize");
var Promise = require("bluebird");
var fs = Promise.promisifyAll(require("fs"));
var path = require("path");
var config = require("../config/config.js");

function initDb() {

    var sequelizeOptions = {
        dialect: config.db.dialect,
        host: config.db.host,
        port: config.db.port,
        benchmark: true
    };

    var sequelize = new Sequelize(config.db.name, config.db.user, config.db.pass, sequelizeOptions);

    var modelPath = __dirname + "/../server/models/*.js";
    var db = sqlizr(sequelize, modelPath);

    return {
        models: db,
        sequelize: sequelize
    };
}

var seedTables = [
    "profile",
    "user",
    "contractor",
    "tag",
    "gig",
    "gig_tag"
];

module.exports = {

    /**
     * Create a new profile with the given email and password.
     * @param {String} email
     * @param {String} password
     * @return {Promise}
     */
    createProfile: function(email, password) {

        if (!email) {
            throw new Error("Email is required");
        }

        if (!password) {
            throw new Error("Password is required");
        }

        console.log("Creating new profile for ", email);

        var db = initDb();

        return db.models.user.findOne({
            where: {
                email: email
            }
        }).then(function(existingUser) {
            if (existingUser) {
                console.log("User already exists with email " + email);
            } else {

                var profile;

                return db.sequelize.transaction(function(t) {

                    return db.models.profile.create({}, {
                        transaction: t
                    }).then(function(result) {
                        profile = result;

                        var bcrypt = require("bcrypt");
                        var salt = bcrypt.genSaltSync(10);
                        var hash = bcrypt.hashSync(password, salt);

                        var userPayload = {
                            profileId: profile.id,
                            email: email,
                            password: hash,
                            active: true
                        };

                        return db.models.user.create(userPayload, {
                            transaction: t
                        });
                    });
                }).then(function() {
                    console.log("Profile and user created!");
                    return;
                });
            }
        });
    },

    smtpTest: function(from, to) {
        const nodemailer = require("nodemailer");

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: config.smtp.service,
            auth: {
                user: config.smtp.user,
                pass: config.smtp.pass
            }
        });

        // setup email data with unicode symbols
        let mailOptions = {
            from: from, // sender address
            to: to, // list of receivers
            subject: "Hello", // Subject line
            text: "Hello world ?", // plain text body
            html: "<b>Hello world ?</b>" // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return;
            }
            console.log("Message %s sent: %s", info.messageId, info.response);
        });
    },

    dumpData: function(table) {

        var db = initDb();

        var tables;
        if (table) {
            tables = [ table ];
        } else {
            tables = seedTables;
        }

        
        return Promise.each(tables, function(table) {

            var queryOptions = {
                raw: true,
                nested: false
            };

            return db.models[table].findAll(queryOptions).then(function(data) {
                var tableFile = path.join(__dirname, "/../server/data", table + ".json");
                console.log("writing file", tableFile);
                return fs.writeFileAsync(tableFile, JSON.stringify(data), { encoding: "utf8" });
            });
        });
    },

    seedData: function() {

        var db = initDb();

        var rawTableList = seedTables.map(function(tableName) {
            return "\"" + tableName + "s\"";
        }).join(", ");

        console.log("truncating tables", rawTableList);
        return db.sequelize.query("TRUNCATE " + rawTableList).then(function() {

            return Promise.each(seedTables, function(table) {
                
                var tableFile = path.join(__dirname, "/../server/data", table + ".json");
                console.log("seeding table", tableFile);
                return fs.readFileAsync(tableFile, { encoding: "utf8" }).then(function(data) {
                    console.log(data);
                    return db.models[table].bulkCreate(JSON.parse(data));
                });
            });
        });
    }
};