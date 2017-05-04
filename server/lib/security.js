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

const Promise = require("bluebird");
const bcrypt = Promise.promisifyAll(require("bcrypt"));
const JWT = require("jsonwebtoken");
const config = require("../../config/config.js");

const db         = require("../db").sequelize;
const models     = db.models;

module.exports = {

    getValidatedUser: (email, password) => {

        var queryOptions = {
            where: {
                email: {
                    ilike: email
                }
            },
            include: [{
                model: models.profile,
                required: true
            }]
        };

        var user;
        return models.user.findOne(queryOptions).then(function(result) {
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
    },

    createToken: (user) => {

        var token = JWT.sign({
            uid: user.id,
            pid: user.profileId,
            scope: user.scope,
            // expires after 7 days
            // TODO is 7 days too long? maybe 24 hours?
            exp: Math.floor(new Date().getTime() / 1000) + 7 * 24 * 60 * 60
        }, config.api.jwt.secret);

        return token;
    }
};
