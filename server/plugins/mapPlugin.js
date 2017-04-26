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
var directions = require("../lib/directions")();

var mapPlugin = {

    register: function(server, options, next) {

        server.route({
            method: "GET",
            path: "/api/v1/map/distance/{placeId}",
            config: {
                cors: {
                    origin: ["*"]
                },
                validate: {
                    params: {
                        placeId: Joi.string().required()
                    }
                }
            },
            handler: function(request, reply) {
                var placeId1, placeId2;

                if (!request.auth.credentials.profile.homeBasePlace) {
                    return reply(Boom.badRequest("Home Base Location not set up"));
                }

                placeId1 = request.auth.credentials.profile.homeBasePlace.place_id;
                placeId2 = request.params.placeId;

                place.distance(placeId1, placeId2).asPromise().then(function(result) {
                    reply(result.json);
                }).catch(function(err) {
                    return reply(Boom.badRequest(err));
                });
            }
        });

        server.route({
            method: "GET",
            path: "/api/v1/map/directions/{placeId}",
            config: {
                cors: {
                    origin: ["*"]
                },
                validate: {
                    params: {
                        placeId: Joi.string().required()
                    }
                }
            },
            handler: function(request, reply) {
                var placeId1, placeId2;

                if (!request.auth.credentials.profile.homeBasePlace) {
                    return reply(Boom.badRequest("Home Base Location not set up"));
                }

                placeId1 = request.auth.credentials.profile.homeBasePlace.place_id;
                placeId2 = request.params.placeId;

                directions.directions(placeId1, placeId2).asPromise().then(function(result) {
                    reply(result.json);
                }).catch(function(err) {
                    return reply(Boom.badRequest(err));
                });
            }
        });

        next();
    }
};

mapPlugin.register.attributes = {
    name: "mapPlugin",
    version: "0.0.1"
};

module.exports = mapPlugin;