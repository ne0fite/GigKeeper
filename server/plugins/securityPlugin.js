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

var Boom = require("boom");
var Joi = require("joi");
var Security = require("../lib/security.js");
var ForgotPassword = require("../lib/forgotPassword.js");

var securityPlugin = {

    register: function(server, options, next) {

        var security = new Security(server);

        server.auth.strategy("jwt", "jwt", security.getJwtOptions());

        server.auth.default("jwt");

        server.route({
            method: "POST",
            path: "/api/v1/login",
            config: {
                validate: {
                    payload: {
                        email: Joi.string().email().required(),
                        password: Joi.string().min(2).max(200).required()
                    }
                },
                auth: false
            },
            handler: function(request, reply) {
                security.getValidatedUser(request.payload.email, request.payload.password).then(function(user) {
                    if (user) {
                        if (user.active) {

                            user.apiToken = security.createToken(user);

                            // TODO: create session

                            return reply(user);
                        } else {
                            return reply(Boom.unauthorized("Account disabled"));
                        }
                    } else {
                        return reply(Boom.unauthorized("Bad email or password"));
                    }
                }).catch(function(err) {
                    return reply(Boom.badImplementation("Failed to authenticate user due to internal error", err.message));
                });
            }
        });

        server.route({
            method: "POST",
            path: "/api/v1/logout",
            config: {
                auth: false
            },
            handler: function(request, reply) {
                // TODO: invalidate session
                return reply();
            }
        });

        server.route({
            method: "POST",
            path: "/api/v1/requestPasswordReset",
            config: {
                validate: {
                    payload: {
                        email: Joi.string().email().required()
                    }
                },
                auth: false
            },
            handler: function(request, reply) {

                var db = server.plugins["hapi-sequelize"].gigkeeperdb;
                var models = db.sequelize.models;

                var queryOptions = {
                    where: {
                        email: {
                            ilike: request.payload.email
                        }
                    }
                };

                models.user.findOne(queryOptions).then(function(user) {

                    if (!user) {
                        throw new Error("User not found for email address " + request.payload.email);
                    }

                    var forgotPassword = new ForgotPassword(server);
                    return forgotPassword.sendPasswordReset(user);
                }).then(function() {
                    reply();
                }).catch(function(error) {
                    reply(Boom.badRequest(error));
                });
            }
        });

        server.route({
            method: "POST",
            path: "/api/v1/resetPassword",
            config: {
                validate: {
                    payload: {
                        token: Joi.string().required(),
                        password: Joi.string().required(),
                        passwordConfirm: Joi.any().valid(Joi.ref("password")).optional().allow(null).options({
                            language: {
                                any: {
                                    allowOnly: "Password and Confirm Password do not match"
                                }
                            }
                        })
                    }
                },
                auth: false
            },
            handler: function(request, reply) {

                var db = server.plugins["hapi-sequelize"].gigkeeperdb;
                var models = db.sequelize.models;

                var queryOptions = {
                    where: {
                        resetToken: request.payload.token
                    }
                };

                var user;
                models.user.findOne(queryOptions).then(function(result) {

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

                    var forgotPassword = new ForgotPassword(server);
                    return forgotPassword.resetPassword(user, request.payload.password);
                }).then(function() {

                    // log the user in
                    var clean = user.get({ plain: true });
                    delete clean.password;

                    // TODO: create session
                    
                    clean.apiToken = security.createToken(user);

                    reply(clean);
                }).catch(function(error) {
                    reply(Boom.badRequest(error));
                });
            }
        });

        next();
    }
};

securityPlugin.register.attributes = {
    name: "securityPlugin",
    version: "0.0.1"
};

module.exports = securityPlugin;