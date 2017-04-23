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

var Chance = require("chance");
var chance = new Chance();
var Mailer = require("./mailer.js");

module.exports = Registration;

function Registration(server) {
    this.server = server;
    this.db = this.server.plugins["hapi-sequelize"].gigkeeperdb;
    this.models = this.db.sequelize.models;
    this.mailer = new Mailer();
}

Registration.prototype.createCode = function() {
    var self = this;

    var code = chance.word({ length: 6 }).toUpperCase();

    var queryOptions = {
        where: {
            code: code
        }
    };

    // make sure the invite code is not already registered
    return self.models.invite.findOne(queryOptions).then(function(invite) {
        if (invite) {
            // keep going until we find a unique code
            return self.createCode();
        } else {
            return code;
        }
    });
};

/**
 * Create or update a new invite code for the email address
 * and send the invite email.
 * @param {String} email
 * @return {Promise}
 */
Registration.prototype.sendInvite = function(email) {
    var self = this;

    return self.db.sequelize.transaction(function(t) {

        var invite;
        var code;

        var userQuery = {
            where: {
                email: email
            }
        };

        return self.models.user.findOne(userQuery).then(function(existingUser) {
            if (existingUser) {
                throw new Error("User already registered with email");
            }

            // create random code
            return self.createCode();
        }).then(function(result) {
            code = result;

            // lookup an existing invite for the user
            var queryOptions = {
                where: {
                    email: email
                }
            };
            return self.models.invite.findOne(queryOptions);
        }).then(function(result) {

            var invitePayload = {
                email: email,
                code: code
            };

            // if found, update, otherwise, create
            if (result) {
                return result.update(invitePayload, {
                    transaction: t
                });
            } else {
                return self.models.invite.create(invitePayload, {
                    transaction: t
                });
            }
        }).then(function(result) {
            invite = result;

            // send email

            // TODO export sender and subject strings - language file?
            var mailOptions = {
                from: "swamsley@gmail.com",
                to: email,
                subject: "[Gig Keeper] Invitation",
            };

            var context = {
                email: email,
                code: code
            };

            return self.mailer.sendEmail(mailOptions, "invite", context);
        }).then(function() {
            return invite;
        });
    });
};

Registration.prototype.createAccount = function(email, password) {
    var self = this;
    
    return self.db.models.user.findOne({
        where: {
            email: email
        }
    }).then(function(existingUser) {
        if (existingUser) {
            throw new Error("Email address already in use");
        } else {

            var profile;

            return self.db.sequelize.transaction(function(t) {

                return self.db.models.profile.create({}, {
                    transaction: t
                }).then(function(result) {
                    profile = result;

                    var bcrypt = require("bcrypt");
                    var salt = bcrypt.genSaltSync(10);
                    var hash = bcrypt.hashSync(password, salt);

                    var userPayload = {
                        profileId: profile.id,
                        email: email,
                        password: hash,
                        active: true
                    };

                    return self.db.models.user.create(userPayload, {
                        transaction: t
                    });
                });
            });
        }
    });
};