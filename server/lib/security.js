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

var Promise = require("bluebird");
var bcrypt = Promise.promisifyAll(require("bcrypt"));
var JWT = require("jsonwebtoken");
var config = require("../../config/config.js");

class Security {

    constructor() {
        this.db         = require("../db").sequelize;
        this.models     = this.db.models;
    }

    getJwtOptions() {
        var self = this;
        return {
            key: config.app.jwt.secret,
            validateFunc: function(decoded, request, callback) {
                self.validateToken(decoded, request, callback);
            },
            verifyOptions: {
                algorithms: ["HS256"]
            }
        };
    }

    getValidatedUser(email, password) {
        var self = this;

        var queryOptions = {
            where: {
                email: {
                    ilike: email
                }
            },
            include: [{
                model: self.models.profile,
                required: true
            }]
        };

        var user;
        return self.models.user.findOne(queryOptions).then(function(result) {
            if (result) {
                user = result;
                return bcrypt.compareAsync(password, user.password);
            } else {
                // TODO: log invalid username
                return false;
            }
        }).then(function(result) {
            if (result) {
                var clean = user.get({ plain: true });
                delete clean.password;
                return clean;
            } else {
                // TODO: log invalid password attempt
                return null;
            }
        });
    }

    createToken(user) {

        var token = JWT.sign({
            uid: user.id,
            pid: user.profileId,
            scope: user.scope,
            // expires after 7 days
            // TODO is 7 days too long? maybe 24 hours?
            exp: Math.floor(new Date().getTime() / 1000) + 7 * 24 * 60 * 60
        }, config.app.jwt.secret);

        return token;
    }

    validateToken(decoded, request, callback) {
        var self = this;

        var queryOptions = {
            where: {
                id: decoded.uid
            }
        };

        self.models.user.findOne(queryOptions).then(function(user) {
            if (user && user.active) {
                callback(null, true);
            } else {
                callback(null, false);
            }
        }).catch(function(error) {
            callback(error, false);
        });
    }
}

module.exports = Security;
