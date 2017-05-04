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

const AbstractController = require("./abstract");
const Promise = require("bluebird");
const place = require("../../lib/place")();
const sheeter = require("../../lib/sheeter");

const db = require("../../db").sequelize;
const models = db.models;

class GigController extends AbstractController {

    async index(ctx) {
        var queryOptions = {
            where: {
                profileId: ctx.state.user.pid
            },
            include: [{
                model: models.contractor,
                required: false
            }, {
                model: models.gig,
                as: "originGig"
            }, {
                model: models.tag
            }],
            order: [
                ["startDate", "desc"]
            ]
        };

        return models.gig.findAll(queryOptions).then(function(gigs) {
            ctx.status = 200;
            ctx.body = gigs;
        }).catch(function(error) {
            ctx.status = 500;
            ctx.body = {
                message: error.message
            };
        });
    }

    async get(ctx, gigId) {

        var queryOptions = {
            where: {
                id: gigId,
                profileId: ctx.state.user.pid
            },
            include: [{
                model: models.gig,
                as: "originGig"
            }, {
                model: models.tag
            }]
        };

        return models.gig.findOne(queryOptions).then(function(gig) {
            if (!gig) {
                ctx.status = 404;
                ctx.body = {
                    message: "Gig Not Found"
                };
            } else {
                ctx.status = 200;
                ctx.body = gig;
            }
        }).catch(function(error) {
            ctx.status = 500;
            ctx.body = {
                message: error.message
            };
        });
    }

    async create(ctx) {

        var payload = ctx.request.body;

        payload.profileId = ctx.state.user.pid;

        var gig;

        return db.sequelize.transaction(function(t) {

            return models.gig.create(payload, { transaction: t }).then(function(result) {
                gig = result;

                if (payload.tags) {
                    return Promise.each(payload.tags, function(tag) {
                        var gigTagPayload = {
                            profileId: ctx.state.user.pid,
                            gigId: gig.id,
                            tagId: tag.id
                        };
                        return models.gig_tag.create(gigTagPayload, { transaction: t });
                    });
                }
            });
        }).then(function() {
            ctx.status = 200;
            ctx.body = gig;
        }).catch(function(error) {
            ctx.status = 500;
            ctx.body = {
                message: error.message
            };
        });
    }

    async update(ctx, gigId) {

        var payload = ctx.request.body;

        var queryOptions = {
            where: {
                id: gigId,
                profileId: ctx.state.user.pid
            }
        };

        var gig;
        return models.gig.findOne(queryOptions).then(function(result) {
            
            ctx.body = {};
            if (!result) {
                throw new Error("Gig not found");
            }
            gig = result;

            return db.sequelize.transaction(function(t) {

                return gig.update(payload, { transaction: t }).then(function() {

                    var clearGigTagOptions = {
                        where: {
                            profileId: ctx.state.user.pid,
                            gigId: gig.id
                        }
                    };
                    return models.gig_tag.destroy(clearGigTagOptions, { transaction: t });
                }).then(function() {
                    if (payload.tags) {
                        return Promise.each(payload.tags, function(tag) {
                            var gigTagPayload = {
                                profileId: ctx.state.user.pid,
                                gigId: gig.id,
                                tagId: tag.id
                            };
                            return models.gig_tag.create(gigTagPayload, { transaction: t });
                        });
                    }
                });
            });
        }).then(function() {
            ctx.status = 200;
            ctx.body = gig;
        }).catch(function(error) {
            ctx.status = 500;
            ctx.body = {
                message: error.message
            };
        });
    }

    async delete(ctx, gigId) {

        var queryOptions = {
            where: {
                id: gigId,
                profileId: ctx.state.user.pid
            }
        };

        return models.gig.findOne(queryOptions).then(function(gig) {
            ctx.body = {};

            if (!gig) {
                ctx.status = 404;
                ctx.body.message = "Gig Not Found";
            } else {
                return gig.destroy();
            }
        }).then(function() {
            ctx.status = 200;
            ctx.body = {};
        }).catch(function(error) {
            ctx.status = 500;
            ctx.body = {
                message: error.message
            };
        });
    }

    async getGigDescriptions(ctx) {
        var queryOptions = {
            raw: true,
            attributes: ["name"],
            where: {
                profileId: ctx.state.user.pid
            },
            group: ["name"],
            order: ["name"]
        };

        return models.gig.findAll(queryOptions).then(function(results) {
            ctx.status = 200;
            ctx.body = results;
        }).catch(function(error) {
            ctx.status = 500;
            ctx.body = {
                message: error.message
            };
        });
    }

    async getGigDistance(ctx, gigId) {

        var queryOptions = {
            where: {
                id: gigId,
                profileId: ctx.state.user.pid
            }
        };

        return models.gig.findOne(queryOptions).then(function(gig) {
            var placeId1, placeId2, distance;

            if (!gig) {
                throw new Error("Gig not found");
            }

            if (!gig.place) {
                throw new Error("Gig does not have a location");
            }

            placeId1 = gig.originPlace.place_id;
            placeId2 = gig.place.place_id;
            distance = place.distance(placeId1, placeId2);

            return distance.asPromise();
        }).then(function(result) {
            ctx.status = 200;
            ctx.body = result.json;
        }).catch(function(error) {
            ctx.status = 500;
            ctx.body = {
                message: error.message
            };
        });
    }

    async export(ctx) {

        var queryOptions = {
            where: {
                profileId: ctx.state.user.pid
            },
            include: [{
                model: models.contractor,
                required: true
            }, {
                model: models.tag
            }],
            order: [ [ "startDate", "desc" ]]
        };

        return models.gig.findAll(queryOptions).then((gigs) => {
            var preparedGigs = gigs.map((gigInstance) => {
                var gig = gigInstance.get({plain: true});

                delete gig.id;
                delete gig.contractorId;
                delete gig.profileId;

                gig.contractor = gig.contractor.name;
                gig.originPlace = gig.originPlace.formatted_address;
                gig.place = gig.place.formatted_address;
                gig.tags = gig.tags
                    .map((tag) => {
                        return tag.name;
                    })
                    .join(", ");

                return gig;
            });

            var sheets = [{
                name: "Gigs",
                data: preparedGigs
            }];

            ctx.body = sheeter.toXLSX(sheets);
            ctx.request.response.attachment("gigs.xlsx");
        }).catch(function(error) {
            ctx.status = 500;
            ctx.body = {
                message: error.message
            };
        });
    }
}

module.exports = GigController;