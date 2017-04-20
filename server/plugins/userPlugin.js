"use strict";

var Boom = require("boom");
var Joi = require("joi");
var Promise = require("bluebird");
var bcrypt = Promise.promisifyAll(require("bcrypt"));

var userPlugin = {

    register: function(server, options, next) {

        server.route({
            method: "GET",
            path: "/api/v1/user/profile",
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
                cors: {
                    origin: ["*"]
                },
                validate: {
                    payload: {
                        email: Joi.string().email().required(),
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
                        email: request.payload.email
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

        next();
    }
};

userPlugin.register.attributes = {
    name: "userPlugin",
    version: "0.0.1"
};

module.exports = userPlugin;