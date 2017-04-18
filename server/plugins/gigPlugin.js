var Boom = require("boom");
var Joi = require("joi");
var GoogleMaps = require("@google/maps");
var Promise = require("bluebird");

var gigPlugin = {

    register: function(server, options, next) {

        server.route({
            method: "GET",
            path: "/api/v1/gig",
            config: {},
            handler: function(request, reply) {

                var db = server.plugins["hapi-sequelize"].gigkeeperdb;
                var models = db.sequelize.models;

                var queryOptions = {
                    where: {
                        profileId: request.auth.credentials.profileId
                    },
                    include: [{
                        model: models.contractor,
                        required: true
                    }, {
                        model: models.tag
                    }],
                    order: [ [ "startDate", "desc" ]]
                };

                models.gig.findAll(queryOptions).then(function(gigs) {
                    reply(gigs);
                }).catch(function(err) {
                    return reply(Boom.badRequest(err));
                });
            }
        });

        server.route({
            method: "GET",
            path: "/api/v1/gig/{id}",
            config: {
                validate: {
                    params: {
                        id: Joi.string().guid().required()
                    }
                }
            },
            handler: function(request, reply) {

                var db = server.plugins["hapi-sequelize"].gigkeeperdb;
                var models = db.sequelize.models;

                var queryOptions = {
                    where: {
                        id: request.params.id,
                        profileId: request.auth.credentials.profileId
                    }
                };

                models.gig.findOne(queryOptions).then(function(result) {
                    if (!result) {
                        throw new Error("Gig not found");
                    }
                    reply(result);
                }).catch(function(err) {
                    return reply(Boom.badRequest(err));
                });
            }
        });

        server.route({
            method: "POST",
            path: "/api/v1/gig",
            config: {
                validate: {
                    payload: {
                        name: Joi.string().required(),
                        place: Joi.object().required(),
                        distance: Joi.number().optional().allow(null),
                        duration: Joi.number().optional().allow(null),
                        startDate: Joi.date().required(),
                        endDate: Joi.date().required(),
                        contractorId: Joi.string().required(),
                        tags: Joi.any().optional()
                    }
                }
            },
            handler: function(request, reply) {

                var db = server.plugins["hapi-sequelize"].gigkeeperdb;
                var models = db.sequelize.models;

                request.payload.profileId = request.auth.credentials.profileId;

                var gig;
                models.gig.create(request.payload).then(function(result) {
                    gig = result;

                    if (request.payload.tags) {
                        return Promise.each(request.payload.tags, function(tag) {
                            var gigTagPayload = {
                                profileId: request.auth.credentials.profileId,
                                gigId: gig.id,
                                tagId: tag.id
                            };
                            return models.gig_tag.create(gigTagPayload);
                        });
                    }
                }).then(function() {
                    reply(gig.get({plain: true}));
                }).catch(function(err) {
                    return reply(Boom.badRequest(err));
                });
            }
        });

        server.route({
            method: "POST",
            path: "/api/v1/gig/{id}",
            config: {
                validate: {
                    params: {
                        id: Joi.string().guid().required()
                    },
                    payload: {
                        name: Joi.string().required(),
                        place: Joi.object().required(),
                        distance: Joi.number().optional().allow(null),
                        duration: Joi.number().optional().allow(null),
                        startDate: Joi.date().required(),
                        endDate: Joi.date().required(),
                        contractorId: Joi.string().required(),
                        tags: Joi.any().optional()
                    }
                }
            },
            handler: function(request, reply) {

                var db = server.plugins["hapi-sequelize"].gigkeeperdb;
                var models = db.sequelize.models;

                var queryOptions = {
                    where: {
                        id: request.params.id,
                        profileId: request.auth.credentials.profileId
                    }
                };

                var gig;
                models.gig.findOne(queryOptions).then(function(result) {
                    if (!result) {
                        throw new Error("Gig not found");
                    }
                    gig = result;
                    return gig.update(request.payload);
                }).then(function() {

                    var clearGigTagOptions = {
                        where: {
                            gigId: gig.id
                        }
                    };
                    return models.gig_tag.destroy(clearGigTagOptions);
                }).then(function() {
                    if (request.payload.tags) {
                        return Promise.each(request.payload.tags, function(tag) {
                            var gigTagPayload = {
                                profileId: request.auth.credentials.profileId,
                                gigId: gig.id,
                                tagId: tag.id
                            };
                            return models.gig_tag.create(gigTagPayload);
                        });
                    }
                }).then(function() {
                    reply(gig);
                }).catch(function(err) {
                    return reply(Boom.badRequest(err));
                });
            }
        });

        server.route({
            method: "DELETE",
            path: "/api/v1/gig/{id}",
            config: {
                validate: {
                    params: {
                        id: Joi.string().guid().required()
                    }
                }
            },
            handler: function(request, reply) {

                var db = server.plugins["hapi-sequelize"].gigkeeperdb;
                var models = db.sequelize.models;

                var queryOptions = {
                    where: {
                        id: request.params.id,
                        profileId: request.auth.credentials.profileId
                    }
                };

                models.gig.findOne(queryOptions).then(function(gig) {
                    if (!gig) {
                        throw new Error("Gig not found");
                    }
                    return gig.destroy();
                }).then(function(result) {
                    reply(result);
                }).catch(function(err) {
                    return reply(Boom.badRequest(err));
                });
            }
        });

        server.route({
            method: "GET",
            path: "/api/v1/gig/{id}/distance",
            config: {
                validate: {
                    params: {
                        id: Joi.string().guid().required()
                    }
                }
            },
            handler: function(request, reply) {
                var db = server.plugins["hapi-sequelize"].gigkeeperdb;
                var models = db.sequelize.models;

                var queryOptions = {
                    where: {
                        id: request.params.id,
                        profileId: request.auth.credentials.profileId
                    }
                };

                if (!request.auth.credentials.profile.homeBasePlace) {
                    return reply(Boom.badRequest("Home Base Location not setup"));
                }

                models.gig.findOne(queryOptions).then(function(gig) {
                    if (!gig) {
                        throw new Error("Gig not found");
                    }
                    
                    if (!gig.place) {
                        throw new Error("Gig does not have a location");
                    }

                    var maps = new GoogleMaps.createClient({
                        key: options.googleApiKey,
                        Promise: Promise
                    });
                    
                    return maps.distanceMatrix({
                        origins: "place_id:" + request.auth.credentials.profile.homeBasePlace.place_id,
                        destinations: "place_id:" + gig.place.place_id
                    }).asPromise();
                }).then(function(result) {
                    reply(result.json);
                }).catch(function(err) {
                    return reply(Boom.badRequest(err));
                });
            }
        });

        server.route({
            method: "GET",
            path: "/api/v1/gig/distance/{placeId}",
            config: {
                validate: {
                    params: {
                        placeId: Joi.string().required()
                    }
                }
            },
            handler: function(request, reply) {

                if (!request.auth.credentials.profile.homeBasePlace) {
                    return reply(Boom.badRequest("Home Base Location not setup"));
                }

                var maps = new GoogleMaps.createClient({
                    key: options.googleApiKey,
                    Promise: Promise
                });
                
                maps.distanceMatrix({
                    origins: "place_id:" + request.auth.credentials.profile.homeBasePlace.place_id,
                    destinations: "place_id:" + request.params.placeId
                }).asPromise().then(function(result) {
                    reply(result.json);
                }).catch(function(err) {
                    return reply(Boom.badRequest(err));
                });
            }
        });

        next();
    }
};

gigPlugin.register.attributes = {
    name: "gigPlugin",
    version: "0.0.1"
};

module.exports = gigPlugin;