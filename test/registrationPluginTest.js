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
var Utils = require("./testUtils.js");

lab.experiment("registration", function () {
    var authCookie;

    var testUserId = "0db8da10-2acd-11e7-885f-3f461b619909";

    lab.before(function (done) {
        setTimeout(function () {
            server.initialize(function () {
                Utils.login("test@example.com", "password").then(function (resCookie) {
                    authCookie = resCookie;
                    done();
                }).catch(function(error) {
                    done(error);
                });
            });
        }, 1000);
    });

    lab.test("Get Invites", function(done) {

        var options = {
            method: "GET",
            url: "/api/v1/register/invite",
            headers: {
                cookie: authCookie
            }
        };

        Utils.sendRequest(options).then(function(response) {
            Code.expect(response.statusCode).to.equal(200);
            done();
        }).catch(function(error) {
            done(error);
        });
    });

    lab.test("Lookup Invite", function(done) {

        var options = {
            method: "GET",
            url: "/api/v1/register/invite/123XYZ",
            headers: {
                cookie: authCookie
            }
        };

        Utils.sendRequest(options).then(function(response) {
            Code.expect(response.statusCode).to.equal(200);
            done();
        }).catch(function(error) {
            done(error);
        });
    });

    lab.test("Send Invite", function(done) {

        var options = {
            method: "POST",
            url: "/api/v1/register/invite",
            headers: {
                cookie: authCookie
            },
            payload: {
                email: chance.email(),
                message: chance.sentence({ words: 10 })
            }
        };

        Utils.sendRequest(options).then(function(response) {
            Code.expect(response.statusCode).to.equal(200);
            var invite = JSON.parse(response.payload);

            Code.expect(invite).to.not.be.undefined();
            Code.expect(invite).to.not.be.null();
            Code.expect(invite.email).to.equal(options.payload.email);
            Code.expect(invite.message).to.equal(options.payload.message);
            Code.expect(invite.userId).to.equal(testUserId);
            Code.expect(invite.code).to.not.be.null();
            Code.expect(invite.code.length).to.equal(6);
            
            done();
        }).catch(function(error) {
            done(error);
        });
    });
});