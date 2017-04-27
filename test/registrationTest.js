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

var Lab = require("lab");
var lab = exports.lab = Lab.script();
var server = require("../main.js");
var Code = require("code");
var Chance = require("chance");
var chance = new Chance();
var Registration = require("../server/lib/registration.js");

lab.experiment("registration", function () {
    var registration;
    var db;
    var models;

    lab.before(function (done) {
        setTimeout(function () {
            server.initialize(function () {
                registration = new Registration(server);
                db = server.plugins["hapi-sequelize"].gigkeeperdb;
                models = db.sequelize.models;
                done();
            });
        }, 1000);
    });

    lab.test("Create Code", function(done) {
        registration.createCode().then(function(code) {
            Code.expect(code).to.not.be.null();
            Code.expect(code.length).to.equal(6);
            done();
        }).catch(function(err) {
            done(err);
        });
    });

    lab.test("Send Invite", function(done) {

        var invitePayload = {
            email: chance.email(),
            message: chance.sentence({ words: 10 })
        };

        var userQuery = {
            where: {
                email: "test@example.com"
            }
        };

        var user;

        models.user.findOne(userQuery).then(function(result) {
            Code.expect(result).to.not.be.null();

            user = result;

            return registration.sendInvite(invitePayload, user);
        }).then(function(invite) {
            
            Code.expect(invite).to.not.be.undefined();
            Code.expect(invite).to.not.be.null();
            Code.expect(invite.email).to.equal(invitePayload.email);
            Code.expect(invite.message).to.equal(invitePayload.message);
            Code.expect(invite.userId).to.equal(user.id);
            Code.expect(invite.code).to.not.be.null();
            Code.expect(invite.code.length).to.equal(6);

            done();
        }).catch(function(err) {
            done(err);
        });
    });
});