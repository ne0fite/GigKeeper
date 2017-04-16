"use strict";

var Boom = require("boom");
var Joi = require("Joi");

var userPlugin = {

    register: function(server, options, next) {

        server.route({
            method: "GET",
            path: "/api/v1/user/profile",
            config: {},
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
                    console.log(err);
                    return reply(Boom.badImplementation());
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