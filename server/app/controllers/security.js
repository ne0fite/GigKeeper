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

const Security = require("../../lib/security");
const ForgotPassword = require("../../lib/forgotPassword.js");

const db = require("../../db").sequelize;
const models = db.models;
const security = new Security();
const forgotPassword = new ForgotPassword();

module.exports = {

    loginAction: async(ctx) => {

        return security.getValidatedUser(ctx.request.body.email, ctx.request.body.password).then(function(user) {

            if (user) {

                if (user.active) {

                    user.apiToken = security.createToken(user);

                    // TODO: create session

                    ctx.status = 200;
                    ctx.body = user;
                } else {
                    ctx.status = 401;
                    ctx.body = {
                        message: "Account disabled"
                    };
                }
            } else {
                ctx.status = 401;
                ctx.body = {
                    message: "Bad email or password"
                };
            }
        }).catch(function(error) {
            ctx.status = 500;
            ctx.body = {
                message: error.message
            };
        });
    },

    logoutAction: async(ctx) => {
        ctx.body = {};

        // TODO: remove session

    },

    requestPasswordResetAction: async(ctx) => {

        var queryOptions = {
            where: {
                email: {
                    ilike: ctx.request.body.email
                }
            }
        };

        return models.user.findOne(queryOptions).then(function(user) {

            if (!user) {
                throw new Error("User not found for email address " + ctx.request.body.email);
            }

            return forgotPassword.sendPasswordReset(user);
        }).then(function() {
            ctx.body = {};
        }).catch(function(error) {
            ctx.status = 500;
            ctx.body = {
                message: error.message
            };
        });
    },

    resetPasswordAction: async(ctx) => {

        var queryOptions = {
            where: {
                resetToken: ctx.request.body.token
            }
        };

        var user;
        return models.user.findOne(queryOptions).then(function(result) {

            if (!result) {
                throw new Error("Invalid token");
            }

            user = result;

            if (!user.active) {
                throw new Error("Account is disabled");
            }

            var now = new Date();
            if (user.resetTokenExpiresAt < now) {
                throw new Error("Token has expired");
            }

            return forgotPassword.resetPassword(user, ctx.request.body.password);
        }).then(function() {

            // log the user in
            var clean = user.get({ plain: true });
            delete clean.password;

            // TODO: create session

            clean.apiToken = security.createToken(user);

            ctx.body = clean;
        }).catch(function(error) {
            ctx.status = 500;
            ctx.body = {
                message: error.message
            };
        });
    }
};