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

const bcrypt = require("bcrypt");
const registration = require("../../lib/registration");

const db = require("../../db").sequelize;
const models = db.models;

module.exports = {

    getProfileAction: async(ctx) => {

        var queryOptions = {
            where: {
                id: ctx.state.user.uid
            },
            include: [{
                model: models.profile,
                required: true
            }]
        };

        return models.user.findOne(queryOptions).then(function(user) {
            if (user) {
                if (user.active) {
                    var clean = user.get({ plain: true });
                    delete clean.password;
                    ctx.body = clean;
                } else {
                    ctx.status = 403;
                    ctx.body = {
                        message: "Account disabled"
                    };
                }
            } else {
                ctx.status = 403;
                ctx.body = {
                    message: "Invalid Session"
                };
            }
        }).catch(function(error) {
            ctx.status = 500;
            ctx.body = {
                message: error.message
            };
        });
    },

    saveProfileAction: async(ctx) => {

        var userOptions = {
            where: {
                id: ctx.state.user.uid
            }
        };

        var user;

        return models.user.findOne(userOptions).then(function(result) {

            if (!result) {
                throw new Error("Invalid Session");
            }

            user = result;

            if (ctx.request.body.password) {
                return bcrypt.genSaltAsync(10).then(function(salt) {
                    return bcrypt.hashAsync(ctx.request.body.password, salt);
                });
            } else {
                return null;
            }
        }).then(function(passwordHash) {
            var payload = ctx.request.body;

            if (passwordHash) {
                payload.password = passwordHash;
            } else if (!payload.password) {
                delete payload.password;
            }

            return user.update(payload);
        }).then(function(user) {
            ctx.status = 200;
            var cleaned = user.get({ plain: true });
            delete cleaned.password;
            ctx.body = cleaned;
        }).catch(function(error) {
            ctx.status = 500;
            ctx.body = {
                message: error.message
            };
        });
    },

    inviteAction: async(ctx) => {

        return registration.sendInvite(ctx.request.body, ctx.state.user).then(function(invite) {
            ctx.body = invite;
        }).catch(function(error) {
            ctx.status = 400;
            ctx.body = {
                message: error.message
            };
        });
    }
};