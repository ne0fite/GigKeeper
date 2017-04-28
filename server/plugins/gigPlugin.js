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

var Boom = require("boom");
var Joi = require("joi");
var Promise = require("bluebird");

var place = require("../lib/place")();
var sheeter = require("../lib/sheeter");

var gigPlugin = {

    register: function(server, options, next) {

        server.route({
            method: "GET",
            path: "/api/v1/gig",
            config: {
                cors: {
                    origin: ["*"]
                }
            },
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
                cors: {
                    origin: ["*"]
                },
                validate: {
                    payload: {
                        name: Joi.string().required(),
                        place: Joi.object().required(),
                        distance: Joi.number().optional().allow(null),
                        duration: Joi.number().optional().allow(null),
                        startDate: Joi.date().required(),
                        endDate: Joi.date().required(),
                        contractorId: Joi.string().required(),
                        tags: Joi.any().optional(),
                        notes: Joi.string().optional().allow(null, "")
                    }
                }
            },
            handler: function(request, reply) {

                var db = server.plugins["hapi-sequelize"].gigkeeperdb;
                var models = db.sequelize.models;

                request.payload.profileId = request.auth.credentials.profileId;

                var gig;

                db.sequelize.transaction(function (t) {

                    return models.gig.create(request.payload, { transaction: t }).then(function(result) {
                        gig = result;

                        if (request.payload.tags) {
                            return Promise.each(request.payload.tags, function(tag) {
                                var gigTagPayload = {
                                    profileId: request.auth.credentials.profileId,
                                    gigId: gig.id,
                                    tagId: tag.id
                                };
                                return models.gig_tag.create(gigTagPayload, { transaction: t });
                            });
                        }
                    });
                }).then(function() {
                    reply(gig);
                }).catch(function(err) {
                    return reply(Boom.badRequest(err));
                });
            }
        });

        server.route({
            method: "POST",
            path: "/api/v1/gig/{id}",
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
                        place: Joi.object().required(),
                        distance: Joi.number().optional().allow(null),
                        duration: Joi.number().optional().allow(null),
                        startDate: Joi.date().required(),
                        endDate: Joi.date().required(),
                        contractorId: Joi.string().required(),
                        tags: Joi.any().optional(),
                        notes: Joi.string().optional().allow(null, "")
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

                    return db.sequelize.transaction(function (t) {

                        return gig.update(request.payload, { transaction: t }).then(function() {

                            var clearGigTagOptions = {
                                where: {
                                    gigId: gig.id
                                }
                            };
                            return models.gig_tag.destroy(clearGigTagOptions, { transaction: t });
                        }).then(function() {
                            if (request.payload.tags) {
                                return Promise.each(request.payload.tags, function(tag) {
                                    var gigTagPayload = {
                                        profileId: request.auth.credentials.profileId,
                                        gigId: gig.id,
                                        tagId: tag.id
                                    };
                                    return models.gig_tag.create(gigTagPayload, { transaction: t });
                                });
                            }
                        });
                    });
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
                }).then(function() {
                    reply();
                }).catch(function(err) {
                    return reply(Boom.badRequest(err));
                });
            }
        });

        server.route({
            method: "GET",
            path: "/api/v1/gig/descriptions",
            config: {
                cors: {
                    origin: ["*"]
                }
            },
            handler: function(request, reply) {

                var db = server.plugins["hapi-sequelize"].gigkeeperdb;
                var models = db.sequelize.models;

                var queryOptions = {
                    raw: true,
                    attributes: [ "name" ],
                    where: {
                        profileId: request.auth.credentials.profileId
                    },
                    group: [ "name" ],
                    order: [ "name" ]
                };

                models.gig.findAll(queryOptions).then(function(results) {
                    reply(results);
                }).catch(function(error) {
                    reply(Boom.badRequest(error));
                });
            }
        });

        server.route({
            method: "GET",
            path: "/api/v1/gig/{id}/distance",
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

                var queryOptions = {
                    where: {
                        id: request.params.id,
                        profileId: request.auth.credentials.profileId
                    }
                };

                if (!request.auth.credentials.profile.homeBasePlace) {
                    return reply(Boom.badRequest("Home Base Location not set up"));
                }

                models.gig.findOne(queryOptions).then(function(gig) {
                    var placeId1, placeId2, distance;

                    if (!gig) {
                        throw new Error("Gig not found");
                    }

                    if (!gig.place) {
                        throw new Error("Gig does not have a location");
                    }

                    placeId1 = request.auth.credentials.profile.homeBasePlace.place_id;
                    placeId2 = gig.place.place_id;
                    distance = place.distance(placeId1, placeId2);

                    return distance.asPromise();
                }).then(function(result) {
                    reply(result.json);
                }).catch(function(err) {
                    return reply(Boom.badRequest(err));
                });
            }
        });

        server.route({
            method: "GET",
            path: "/api/v1/gig/export",
            config: {
                cors: {
                    origin: ["*"]
                }
            },
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

                models.gig.findAll(queryOptions).then((gigs) => {
                    var preparedGigs = gigs.map((gigInstance) => {
                        var gig = gigInstance.get({plain: true});

                        delete gig.id;
                        delete gig.contractorId;
                        delete gig.profileId;

                        gig.contractor = gig.contractor.name;
                        gig.place = gig.place.formatted_address;
                        gig.tags = gig.tags
                            .map((tag) => {
                                return tag.name;
                            })
                            .join(", ");

                        return gig;
                    });

                    var sheets = [
                        {
                            name: "Gigs",
                            data: preparedGigs
                        }
                    ];

                    return reply(sheeter.toXLSX(sheets))
                        .type("application/vnd.ms-excel")
                        .header("Content-Disposition", "attachment; filename=\"gigs.xlsx\"");
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