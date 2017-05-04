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
var config = require("../../config/config.js");

module.exports = Registration;

function Registration() {
    this.db = require("../db").sequelize;
    this.models = this.db.models;
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
 * @param {Object} token
 * @return {Promise}
 */
Registration.prototype.sendInvite = function(payload, token) {
    var self = this;

    return self.db.sequelize.transaction(function(t) {

        var invitePayload = {
            email: payload.email,
            message: payload.message,
            code: null,
            userId: token.uid
        };

        var inviteUserQuery = {
            where: {
                id: token.uid
            }
        };

        var inviteUser;
        return self.models.user.findOne(inviteUserQuery).then(function(result) {
            if (!result) {
                throw new Error("Invalid token");
            }

            inviteUser = result;

            var userQuery = {
                where: {
                    email: {
                        ilike: payload.email
                    }
                }
            };

            return self.models.user.findOne(userQuery);
        }).then(function(existingUser) {
            if (existingUser) {
                throw new Error("User already registered with email");
            }

            // create random code
            return self.createCode();
        }).then(function(result) {
            invitePayload.code = result;

            // lookup an existing invite for the user
            var queryOptions = {
                where: {
                    email: {
                        ilike: payload.email
                    }
                }
            };
            return self.models.invite.findOne(queryOptions);
        }).then(function(result) {

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
        }).then(function(invite) {

            // send email

            // TODO export sender and subject strings - language file?
            var mailOptions = {
                from: config.smtp.fromAddress,
                to: payload.email,
                subject: "[Gig Keeper] Invitation",
            };

            invitePayload.user = inviteUser;

            self.mailer.sendEmail(mailOptions, "invite", invitePayload).catch(function(error) {
                // TODO logging component
                console.log("Failed to send invite email: " + error.message);
            });
            
            return invite;
        });
    });
};

Registration.prototype.createAccount = function(payload) {
    var self = this;
    
    return self.db.models.user.findOne({
        where: {
            email: {
                ilike: payload.email
            }
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
                    var hash = bcrypt.hashSync(payload.password, salt);

                    var userPayload = {
                        profileId: profile.id,
                        email: payload.email,
                        firstName: payload.firstName,
                        lastName: payload.lastName,
                        phone: payload.phone,
                        password: hash,
                        active: true
                    };

                    return self.db.models.user.create(userPayload, {
                        transaction: t
                    });
                });
            }).then(function(newUser) {

                // TODO export sender and subject strings - language file?
                var mailOptions = {
                    from: config.smtp.fromAddress,
                    to: config.smtp.fromAddress,
                    subject: "[Gig Keeper] New Account Created",
                };

                var context = {
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    email: newUser.email,
                    phone: newUser.phone,
                };

                self.mailer.sendEmail(mailOptions, "registrationNotice", context).catch(function(error) {
                    // TODO logging component
                    console.log("Failed to send registration notification email: " + error.message);
                });

                return newUser;
            });
        }
    });
};