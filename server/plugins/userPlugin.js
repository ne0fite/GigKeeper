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
var Promise = require("bluebird");
var bcrypt = Promise.promisifyAll(require("bcrypt"));
var Registration = require("../lib/registration.js");

var userPlugin = {

    register: function(server, options, next) {

        server.route({
            method: "GET",
            path: "/api/v1/user/profile",
            handler: function(request, reply) {

                var db = server.plugins["hapi-sequelize"].gigkeeperdb;
                var models = db.sequelize.models;

                var options = {
                    where: {
                        id: request.auth.credentials.id
                    },
                    include: [{
                        model: models.profile,
                        required: true
                    }]
                };

                models.user.findOne(options).then(function(user) {
                    if (user) {
                        if (user.active) {
                            var clean = user.get({ plain: true });
                            delete clean.password;
                            return reply(clean);
                        } else {
                            return reply(Boom.unauthorized("Account disabled"));
                        }
                    } else {
                        return reply(Boom.unauthorized("Invalid Session"));
                    }
                }).catch(function(err) {
                    return reply(Boom.badImplementation("Failed to get user profile due to internal error: " + err.message));
                });
            }
        });

        server.route({
            method: "POST",
            path: "/api/v1/user/profile",
            config: {
                validate: {
                    payload: {
                        firstName: Joi.string().optional().allow(null, ""),
                        lastName: Joi.string().optional().allow(null, ""),
                        email: Joi.string().email().required(),
                        phone: Joi.string().optional().allow(null, ""),
                        password: Joi.string().optional().allow(null),
                        passwordConfirm: Joi.any().valid(Joi.ref("password")).optional().allow(null).options({ 
                            language: { 
                                any: { 
                                    allowOnly: "Password and Confirm Password do not match"
                                } 
                            } 
                        })
                    }
                }
            },
            handler: function(request, reply) {

                var db = server.plugins["hapi-sequelize"].gigkeeperdb;
                var models = db.sequelize.models;

                var userOptions = {
                    where: {
                        id: request.auth.credentials.id
                    }
                };

                var user;

                models.user.findOne(userOptions).then(function(result) {

                    if (!result) {
                        throw new Error("Invalid Session");
                    }

                    user = result;

                    if (request.payload.password) {
                        return bcrypt.genSaltAsync(10).then(function(salt) {
                            return bcrypt.hashAsync(request.payload.password, salt);
                        });
                    } else {
                        return null;
                    }
                }).then(function(passwordHash) {
                    var payload = {
                        email: request.payload.email,
                        firstName: request.payload.firstName,
                        lastName: request.payload.lastName,
                        phone: request.payload.phone
                    };

                    if (passwordHash) {
                        payload.password = passwordHash;
                    }

                    return user.update(payload);
                }).then(function() {
                    reply();
                }).catch(function(err) {
                    return reply(Boom.badImplementation("Failed to update user profile due to internal error: " + err.message)); 
                });
            }
        });

        server.route({
            method: "POST",
            path: "/api/v1/user/invite",
            config: {
                validate: {
                    payload: {
                        email: Joi.string().email().required()
                    }
                }
            },
            handler: function(request, reply) {

                var registration = new Registration(server);
                
                registration.sendInvite(request.payload.email).then(function() {
                    reply();
                }).catch(function(err) {
                    return reply(Boom.badImplementation("Failed to update user profile due to internal error: " + err.message)); 
                });
            }
        });

        next();
    }
};

userPlugin.register.attributes = {
    name: "userPlugin",
    version: "0.0.1"
};

module.exports = userPlugin;