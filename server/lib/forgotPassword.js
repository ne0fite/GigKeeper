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


var Mailer = require("./mailer.js");

module.exports = ForgotPassword;

function ForgotPassword(server) {
    this.server = server;
    this.db = this.server.plugins["hapi-sequelize"].gigkeeperdb;
    this.models = this.db.sequelize.models;
    this.mailer = new Mailer();
}

ForgotPassword.prototype.sendPasswordReset = function(user) {
    var self = this;

    // create a secure token
    var createHash = require("sha.js");
    var sha256 = createHash("sha256");
    var secureRandom = require("secure-random");

    var bytes = secureRandom(10);
    var token = sha256.update(bytes, "utf8").digest("hex");
    
    // token is good for 24 hours
    var now = new Date().getTime();
    var expires = new Date(now + (24 * 60 * 60 * 1000));

    var updatePayload = {
        resetToken: token,
        resetTokenExpiresAt: expires
    };

    return user.update(updatePayload).then(function() {

        var mailOptions = {
            from: "swamsley@gmail.com",
            to: user.email,
            subject: "[Gig Keeper] Password Reset",
        };
        
        updatePayload.user = user;

        self.mailer.sendEmail(mailOptions, "passwordReset", updatePayload).catch(function(error) {
            // TODO logging component
            console.log("Failed to send password reset email: " + error.message);
        });

        return;
    });
};

ForgotPassword.prototype.resetPassword = function(user, password) {

    var bcrypt = require("bcrypt");
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);

    var userPayload = {
        password: hash,
        resetToken: null,
        resetTokenExpiresAt: null
    };

    return user.update(userPayload);
};

