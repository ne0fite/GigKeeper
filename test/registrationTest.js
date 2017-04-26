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

    lab.before(function (done) {
        setTimeout(function () {
            server.initialize(function () {
                registration = new Registration(server);
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

        var email = chance.email();

        registration.sendInvite(email).then(function(invite) {
            
            Code.expect(invite).to.not.be.undefined();
            Code.expect(invite).to.not.be.null();
            Code.expect(invite.email).to.equal(email);
            Code.expect(invite.code).to.not.be.null();
            Code.expect(invite.code.length).to.equal(6);

            done();
        }).catch(function(err) {
            done(err);
        });
    });
});