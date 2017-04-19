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
                    origin: ['*']
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
                    origin: ['*']
                },
                validate: {
                    payload: {
                        homeBasePlace: Joi.object().optional().allow(null).default(null)
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
                    var result;

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