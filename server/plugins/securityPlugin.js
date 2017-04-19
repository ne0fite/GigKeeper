var Boom = require("boom");
var Joi = require("joi");
var bcrypt = require("bcrypt");
var Promise = require("bluebird");

var securityPlugin = {

    register: function(server, options, next) {

        server.route({
            method: "POST",
            path: "/api/v1/login",
            config: {
                cors: {
                    origin: ['*']
                },
                validate: {
                    payload: {
                        email: Joi.string().email().required(),
                        password: Joi.string().min(2).max(200).required()
                    }
                },
                auth: false
            },
            handler: function(request, reply) {
                getValidatedUser(request.payload.email, request.payload.password).then(function(user) {
                    if (user) {
                        if (user.active) {
                            request.cookieAuth.set(user);
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
                cors: {
                    origin: ['*']
                },
                auth: false
            },
            handler: function(request, reply) {
                request.cookieAuth.clear();
                return reply();
            }
        });

        function getValidatedUser(email, password) {
            return new Promise(function(resolve, reject) {
                var db = server.plugins["hapi-sequelize"].gigkeeperdb;
                var models = db.sequelize.models;

                var options = {
                    where: {
                        email: email
                    },
                    include: [{
                        model: models.profile,
                        required: true
                    }]
                };

                models.user.findOne(options).then(function(user) {
                    if (user) {

                        bcrypt.compare(password, user.password, function(err, result) {
                            if (err) {
                                reject(new Error(err));
                            }

                            if (result) {
                                var clean = user.get({ plain: true });
                                //clean.profile = user.profile.get({ plain: true });
                                delete clean.password;
                                resolve(clean);
                            } else {
                                // TODO: log invalid password attempt
                                resolve(null);
                            }
                        });
                    } else {
                        // TODO: log invalid username
                        resolve(null);
                    }
                }).catch(function(error) {
                    reject(error);
                });
            });
        }

        next();
    }
};

securityPlugin.register.attributes = {
    name: "securityPlugin",
    version: "0.0.1"
};

module.exports = securityPlugin;