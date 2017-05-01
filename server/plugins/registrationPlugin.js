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
var Registration = require("../lib/registration.js");

var registrationPlugin = {

    register: function(server, options, next) {

        server.route({
            method: "GET",
            path: "/api/v1/register/invite",
            handler: function(request, reply) {

                var db = server.plugins["hapi-sequelize"].gigkeeperdb;
                var models = db.sequelize.models;

                var queryOptions = {
                    include: [{
                        model: models.user,
                        required: true,
                        where: {
                            profileId: request.auth.credentials.profileId
                        }
                    }],
                    order: [ [ "createdAt", "asc" ] ]
                };

                models.invite.findAll(queryOptions).then(function(invites) {
                    reply(invites);
                }).catch(function(error) {
                    reply(Boom.badRequest(error));
                });
            }
        });

        server.route({
            method: "GET",
            path: "/api/v1/register/invite/{code}",
            config: {
                validate: {
                    params: {
                        code: Joi.string().required()
                    }
                },
                auth: false
            },
            handler: function(request, reply) {

                var db = server.plugins["hapi-sequelize"].gigkeeperdb;
                var models = db.sequelize.models;

                var queryOptions = {
                    where: {
                        code: request.params.code
                    }
                };

                models.invite.findOne(queryOptions).then(function(invite) {
                    reply(invite);
                }).catch(function(err) {
                    reply(Boom.badImplementation(err));
                });
            }
        });

        server.route({
            method: "POST",
            path: "/api/v1/register/invite",
            config: {
                validate: {
                    payload: {
                        email: Joi.string().email().required(),
                        message: Joi.string().optional().allow(null, "")
                    }
                },
                auth: {
                    strategy: "base",
                    scope: "admin"
                }
            },
            handler: function(request, reply) {

                var registration = new Registration(server);
                return registration.sendInvite(request.payload, request.auth.credentials).then(function(invite) {
                    reply(invite);
                }).catch(function(error) {
                    reply(Boom.badRequest(error));
                });
            }
        });

        server.route({
            method: "POST",
            path: "/api/v1/register/invite/{code}",
            config: {
                validate: {
                    params: {
                        code: Joi.string().required()
                    },
                    payload: {
                        email: Joi.string().email().required(),
                        firstName: Joi.string().optional().allow(null, ""),
                        lastName: Joi.string().optional().allow(null, ""),
                        phone: Joi.string().optional().allow(null, ""),
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
                        code: request.params.code
                    }
                };

                var invite;
                var newUser;

                // validate the invitation code by looking it up by code
                models.invite.findOne(queryOptions).then(function(result) {
                    invite = result;

                    if (!invite) {
                        throw new Error("Invalid Invite Code");
                    }

                    // register the user with the payload
                    var registration = new Registration(server);
                    return registration.createAccount(request.payload);
                }).then(function(result) {
                    newUser = result;

                    // update the invitation with registration date and profile ID
                    var invitePayload = {
                        registeredAt: new Date(),
                        profileId: newUser.profileId
                    };
                    return invite.update(invitePayload);
                }).then(function() {

                    // look up the new user
                    var queryOptions = {
                        where: {
                            id: newUser.id
                        },
                        include: [{
                            model: models.profile,
                            required: true
                        }]
                    };
                    return models.user.findOne(queryOptions);
                }).then(function(user) {

                    // add the user to the auth credentials to log the user in
                    var clean = user.get({ plain: true });
                    delete clean.password;

                    request.cookieAuth.set(clean);

                    reply(clean);
                }).catch(function(err) {
                    reply(Boom.badRequest(err));
                });
            }
        });

        next();
    }
};

registrationPlugin.register.attributes = {
    name: "registrationPlugin",
    version: "0.0.1"
};

module.exports = registrationPlugin;