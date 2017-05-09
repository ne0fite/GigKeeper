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

const Promise = require("bluebird");
const sheeter = require("../../lib/sheeter");

const db = require("../../db").sequelize;
const models = db.models;

module.exports = {

    index: async (ctx) => {

        var queryOptions = {
            where: {
                profileId: ctx.state.user.pid
            }
        };

        if (ctx.request.query.sort && ctx.request.query.sort.length > 0) {
            var sortDefs = Array.isArray(ctx.request.query.sort) ? ctx.request.query.sort : [ ctx.request.query.sort ];
            queryOptions.order = sortDefs.map(function(sortJson) {
                var sortDef = JSON.parse(sortJson);
                return [
                    sortDef.field,
                    sortDef.dir
                ];
            });
        } else {
            queryOptions.order = [
                ["name", "asc"]
            ];
        }

        var pagedQueryOptions = Object.assign({
            limit: ctx.request.query.limit,
            offset: ctx.request.query.offset
        }, queryOptions);

        var countQuery = models.contractor.count(pagedQueryOptions);
        var findAllQuery = models.contractor.findAll(queryOptions);
        return Promise.all([ countQuery, findAllQuery ]).spread(function(countResults, findAllResults) {
            ctx.status = 200;
            ctx.body = {
                totalRows: countResults,
                data: findAllResults
            };
        }).catch(function(error) {
            ctx.status = 500;
            ctx.body = {
                message: error.message
            };
        });
    },

    get: async (ctx, contractorId) => {
        
        var queryOptions = {
            where: {
                id: contractorId,
                profileId: ctx.state.user.pid
            }
        };

        return models.contractor.findOne(queryOptions).then(function(contractor) {
            if (!contractor) {
                ctx.status = 404;
            } else {
                ctx.body = contractor;
            }
        }).catch(function(error) {
            ctx.status = 500;
            ctx.body = {
                message: error.message
            };
        });
    },

    create: async (ctx) => {

        var payload = ctx.request.body;

        payload.profileId = ctx.state.user.pid;

        return models.contractor.create(payload).then(function(contractor) {
            ctx.body = contractor;
        }).catch(function(error) {
            ctx.status = 500;
            ctx.body = {
                message: error.message
            };
        });
    },

    update: async (ctx, contractorId) => {

        var queryOptions = {
            where: {
                id: contractorId,
                profileId: ctx.state.user.pid
            }
        };

        var contractor;
        return models.contractor.findOne(queryOptions).then(function(result) {
            ctx.body = {};
            if (!result) {
                ctx.status = 404;
                ctx.body.message = "Contractor Not Found";
            } else {
                contractor = result;
                return contractor.update(ctx.request.body);
            }
        }).then(function() {
            ctx.body = contractor;
        }).catch(function(error) {
            ctx.status = 500;
            ctx.body = {
                message: error.message
            };
        });
    },

    delete: async (ctx, contractorId) => {

        var queryOptions = {
            where: {
                id: contractorId,
                profileId: ctx.state.user.pid
            }
        };

        return models.contractor.findOne(queryOptions).then(function(contractor) {
            ctx.body = {};

            if (!contractor) {
                ctx.status = 404;
                ctx.body.message = "Contractor Not Found";
            } else {
                return contractor.destroy();
            }
        }).catch(function(error) {
            ctx.status = 500;
            ctx.body = {
                message: error.message
            };
        });
    },

    export: async (ctx) => {
        var queryOptions = {
            where: {
                profileId: ctx.state.user.pid
            },
            order: [ "name" ]
        };

        return models.contractor.findAll(queryOptions).then(function(contractors) {
            var preparedContractors = contractors.map((contractorInstance) => {
                var contractor = contractorInstance.get({plain: true});

                delete contractor.id;
                delete contractor.profileId;

                return contractor;
            });

            var sheets = [{
                name: "Contractors",
                data: preparedContractors
            }];

            ctx.body = sheeter.toXLSX(sheets);
            ctx.request.response.attachment("contractors.xlsx");
        }).catch(function(error) {
            ctx.status = 500;
            ctx.body = {
                message: error.message
            };
        });
    }
};