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
const Registration = require("../../lib/registration.js");
const Security = require("../../lib/security.js");

const db = require("../../db").sequelize;
const models = db.models;

class RegistrationController extends AbstractController {

    inviteIndex(ctx, next) {

        if (ctx.state.user.scope == "admin") {

            var queryOptions = {
                include: [{
                    model: models.user,
                    required: true,
                    where: {
                        profileId: ctx.state.user.pid
                    }
                }],
                order: [ [ "createdAt", "asc" ] ]
            };

            return models.invite.findAll(queryOptions).then(function(invites) {
                ctx.body = invites;
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
    }

    getInvite(ctx, code, next) {

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
    }

    sendInvite(ctx, next) {
        if (ctx.state.user.scope == "admin") {
            var registration = new Registration();
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
    }

    registerInvite(ctx, code, next) {

        const security = new Security();

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
            var registration = new Registration();
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
}

module.exports = RegistrationController;