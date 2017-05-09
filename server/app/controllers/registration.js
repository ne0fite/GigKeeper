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

const registration = require("../../lib/registration.js");
const security = require("../../lib/security.js");

const db = require("../../db").sequelize;
const models = db.models;

module.exports = {

    inviteIndex: async (ctx) => {

        if (ctx.state.user.scope == "admin") {

            var queryOptions = {
                include: [{
                    model: models.user,
                    required: true,
                    where: {
                        profileId: ctx.state.user.pid
                    }
                }]
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
                    ["createdAt", "desc"]
                ];
            }

            var pagedQueryOptions = Object.assign({
                limit: ctx.request.query.limit,
                offset: ctx.request.query.offset
            }, queryOptions);

            var countQuery = models.invite.count(queryOptions);
            var findAllQuery = models.invite.findAll(pagedQueryOptions);
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
        } else {
            ctx.status = 403;
            ctx.body = {
                message: "Insufficient Privileges"
            };
        }
    },

    getInvite: async (ctx, code) => {

        var queryOptions = {
            where: {
                code: code
            }
        };

        return models.invite.findOne(queryOptions).then(function(invite) {
            ctx.body = invite;
        }).catch(function(error) {
            ctx.status = 500;
            ctx.body = {
                message: error.message
            };
        });
    },

    sendInvite: async (ctx) => {
        if (ctx.state.user.scope == "admin") {
            
            return registration.sendInvite(ctx.request.body, ctx.state.user).then(function(invite) {
                ctx.body = invite;
            }).catch(function(error) {
                ctx.status = 500;
                ctx.body = {
                    message: error.message
                };
            });
        } else {
            ctx.status = 403;
            ctx.body = {
                message: "Insufficient Privileges"
            };
        }
    },

    registerInvite: async (ctx, code) => {

        var queryOptions = {
            where: {
                code: code
            }
        };

        var invite;
        var newUser;

        // validate the invitation code by looking it up by code
        return models.invite.findOne(queryOptions).then(function(result) {
            invite = result;

            if (!invite) {
                throw new Error("Invalid Invite Code");
            }

            // register the user with the payload
            return registration.createAccount(ctx.request.body);
        }).then(function(result) {
            newUser = result;

            // update the invitation with registration date and profile ID
            var invitePayload = {
                registeredAt: new Date(),
                profileId: newUser.profileId
            };
            return invite.update(invitePayload);
        }).then(function() {

            // look up the new user
            var queryOptions = {
                where: {
                    id: newUser.id
                },
                include: [{
                    model: models.profile,
                    required: true
                }]
            };
            return models.user.findOne(queryOptions);
        }).then(function(user) {

            // add the user to the auth credentials to log the user in
            var clean = user.get({ plain: true });
            delete clean.password;

            // TODO: create session

            clean.apiToken = security.createToken(user);
            
            ctx.body = clean;
        }).catch(function(error) {
            ctx.status = 500;
            ctx.body = {
                message: error.message
            };
        });
    }
};