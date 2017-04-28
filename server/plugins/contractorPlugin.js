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

var sheeter = require("../lib/sheeter");

var contractorPlugin = {

    register: function(server, options, next) {

        server.route({
            method: "GET",
            path: "/api/v1/contractor",
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

                models.contractor.findAll(options).then(function(contractors) {
                    reply(contractors);
                }).catch(function(err) {
                    return reply(Boom.badRequest(err));
                });
            }
        });

        server.route({
            method: "POST",
            path: "/api/v1/contractor",
            config: {
                cors: {
                    origin: ["*"]
                },
                validate: {
                    payload: {
                        name: Joi.string().required(),
                        contact: Joi.string().optional().allow(null, ""),
                        address1: Joi.string().allow(null, ""),
                        address2: Joi.string().allow(null, ""),
                        city: Joi.string().allow(null, ""),
                        region: Joi.string().allow(null, ""),
                        postalCode: Joi.string().allow(null, ""),
                        phone: Joi.string().allow(null, ""),
                        email: Joi.string().email().allow(null, ""),
                        web: Joi.string().allow(null, "")
                    }
                }
            },
            handler: function(request, reply) {

                var db = server.plugins["hapi-sequelize"].gigkeeperdb;
                var models = db.sequelize.models;

                request.payload.profileId = request.auth.credentials.profileId;

                models.contractor.create(request.payload).then(function(contractor) {
                    reply(contractor);
                }).catch(function(err) {
                    return reply(Boom.badRequest(err));
                });
            }
        });

        server.route({
            method: "POST",
            path: "/api/v1/contractor/{id}",
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
                        contact: Joi.string().optional().allow(null, ""),
                        address1: Joi.string().allow(null, ""),
                        address2: Joi.string().allow(null, ""),
                        city: Joi.string().allow(null, ""),
                        region: Joi.string().allow(null, ""),
                        postalCode: Joi.string().allow(null, ""),
                        phone: Joi.string().allow(null, ""),
                        email: Joi.string().email().allow(null, ""),
                        web: Joi.string().allow(null, "")
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

                var contractor;
                models.contractor.findOne(options).then(function(result) {
                    if (!result) {
                        throw new Error("Contractor not found");
                    }
                    contractor = result;
                    return contractor.update(request.payload);
                }).then(function() {
                    reply(contractor);
                }).catch(function(err) {
                    return reply(Boom.badRequest(err));
                });
            }
        });

        server.route({
            method: "DELETE",
            path: "/api/v1/contractor/{id}",
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

                models.contractor.findOne(options).then(function(contractor) {
                    if (!contractor) {
                        throw new Error("Contractor not found");
                    }
                    return contractor.destroy();
                }).then(function() {
                    reply();
                }).catch(function(err) {
                    return reply(Boom.badRequest(err));
                });
            }
        });

        server.route({
            method: "GET",
            path: "/api/v1/contractor/export",
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

                models.contractor.findAll(options).then(function(contractors) {
                    var preparedContractors = contractors.map((contractorInstance) => {
                        var contractor = contractorInstance.get({plain: true});

                        delete contractor.id;
                        delete contractor.profileId;

                        return contractor;
                    });

                    var sheets = [
                        {
                            name: "Contractors",
                            data: preparedContractors
                        }
                    ];

                    return reply(sheeter.toXLSX(sheets))
                        .type("application/vnd.ms-excel")
                        .header("Content-Disposition", "attachment; filename=\"contractors.xlsx\"");
                }).catch(function(err) {
                    return reply(Boom.badRequest(err));
                });
            }
        });

        next();
    }
};

contractorPlugin.register.attributes = {
    name: "contractorPlugin",
    version: "0.0.1"
};

module.exports = contractorPlugin;