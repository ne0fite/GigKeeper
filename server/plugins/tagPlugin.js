var Boom = require("boom");
var Joi = require("joi");

var tagPlugin = {

    register: function(server, options, next) {

        server.route({
            method: "GET",
            path: "/api/v1/tag",
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
                        profileId: request.auth.credentials.profileId
                    },
                    order: [ "name" ]
                };

                models.tag.findAll(options).then(function(tags) {
                    reply(tags);
                }).catch(function(err) {
                    return reply(Boom.badRequest(err));
                });
            }
        });

        server.route({
            method: "POST",
            path: "/api/v1/tag",
            config: {
                cors: {
                    origin: ["*"]
                },
                validate: {
                    payload: {
                        name: Joi.string().required(),
                        description: Joi.string().optional().allow(null, "")
                    }
                }
            },
            handler: function(request, reply) {

                var db = server.plugins["hapi-sequelize"].gigkeeperdb;
                var models = db.sequelize.models;

                request.payload.profileId = request.auth.credentials.profileId;

                models.tag.create(request.payload).then(function(tag) {
                    reply(tag);
                }).catch(function(err) {
                    return reply(Boom.badRequest(err));
                });
            }
        });

        server.route({
            method: "POST",
            path: "/api/v1/tag/{id}",
            config: {
                cors: {
                    origin: ["*"]
                },
                validate: {
                    params: {
                        id: Joi.string().guid().required()
                    },
                    payload: {
                        name: Joi.string().required(),
                        description: Joi.string().optional().allow(null, "")
                    }
                }
            },
            handler: function(request, reply) {

                var db = server.plugins["hapi-sequelize"].gigkeeperdb;
                var models = db.sequelize.models;

                var options = {
                    where: {
                        id: request.params.id,
                        profileId: request.auth.credentials.profileId
                    }
                };

                var tag;
                models.tag.findOne(options).then(function(result) {
                    if (!result) {
                        throw new Error("Tag not found");
                    }
                    tag = result;
                    return tag.update(request.payload);
                }).then(function() {
                    reply(tag);
                }).catch(function(err) {
                    return reply(Boom.badRequest(err));
                });
            }
        });

        server.route({
            method: "DELETE",
            path: "/api/v1/tag/{id}",
            config: {
                cors: {
                    origin: ["*"]
                },
                validate: {
                    params: {
                        id: Joi.string().guid().required()
                    }
                }
            },
            handler: function(request, reply) {

                var db = server.plugins["hapi-sequelize"].gigkeeperdb;
                var models = db.sequelize.models;

                var options = {
                    where: {
                        id: request.params.id,
                        profileId: request.auth.credentials.profileId
                    }
                };

                models.tag.findOne(options).then(function(tag) {
                    if (!tag) {
                        throw new Error("Contractor not found");
                    }
                    return tag.destroy();
                }).then(function(result) {
                    reply(result);
                }).catch(function(err) {
                    return reply(Boom.badRequest(err));
                });
            }
        });

        next();
    }
};

tagPlugin.register.attributes = {
    name: "tagPlugin",
    version: "0.0.1"
};

module.exports = tagPlugin;