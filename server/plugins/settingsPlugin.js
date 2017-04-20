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

var settingsPlugin = {

    register: function(server, options, next) {

        server.route({
            method: "GET",
            path: "/api/v1/settings",
            config: {
                cors: {
                    origin: ["*"]
                }
            },
            handler: function(request, reply) {

                var db = server.plugins["hapi-sequelize"].gigkeeperdb;
                var models = db.sequelize.models;

                var options = {
                    where: {
                        id: request.auth.credentials.profileId
                    }
                };

                models.profile.findOne(options).then(function(profile) {
                    if (profile) {
                        var settings = {
                            homeBasePlace: profile.homeBasePlace
                        };
                        return reply(settings);
                    } else {
                        return reply(Boom.unauthorized("Invalid Session"));
                    }
                }).catch(function(err) {
                    console.log(err);
                    return reply(Boom.badImplementation());
                });
            }
        });

        server.route({
            method: "POST",
            path: "/api/v1/settings",
            config: {
                cors: {
                    origin: ["*"]
                },
                validate: {
                    payload: {
                        homeBasePlace: Joi.object().optional().allow(null).default(null),
                        defaultDuration: Joi.number().integer().optional().allow(null)
                    }
                }
            },
            handler: function(request, reply) {

                var db = server.plugins["hapi-sequelize"].gigkeeperdb;
                var models = db.sequelize.models;
                var credentials = Object.assign({}, request.auth.credentials);

                var options = {
                    where: {
                        id: request.auth.credentials.profileId
                    }
                };

                models.profile.findOne(options).then(function(profile) {

                    if (profile) {
                        credentials.profile = request.payload;
                        request.cookieAuth.set(credentials);

                        return profile.update(request.payload);
                    } else {
                        throw new Error("Invalid Session");
                    }
                }).then(function() {
                    return reply();
                }).catch(function(err) {
                    console.log(err);
                    return reply(Boom.badImplementation());
                });
            }
        });

        next();
    }
};

settingsPlugin.register.attributes = {
    name: "settingsPlugin",
    version: "0.0.1"
};

module.exports = settingsPlugin;