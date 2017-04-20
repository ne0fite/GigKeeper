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

lab.experiment("tag", function () {
    var authCookie;

    var tagId;

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

    lab.test("Get Tags", function(done) {
        var options = {
            method: "GET",
            url: "/api/v1/tag",
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

    lab.test("Create Tag", function (done) {
        
        var options = {
            method: "POST",
            url: "/api/v1/tag",
            headers: {
                cookie: authCookie
            },
            payload: {
                name: chance.sentence({words: 2}),
                description: chance.sentence({words: 5})
            }
        };

        Utils.sendRequest(options).then(function(response) {
            // console.log(response.payload);
            Code.expect(response.statusCode).to.equal(200);
            var responsePayload = JSON.parse(response.payload);
            tagId = responsePayload.id;
            Code.expect(responsePayload.name).to.equal(options.payload.name);
            Code.expect(responsePayload.description).to.equal(options.payload.description);
            done();
        }).catch(function(error) {
            done(error);
        });
    });

    lab.test("Update Tag", function (done) {
        
        var options = {
            method: "POST",
            url: "/api/v1/tag/" + tagId,
            headers: {
                cookie: authCookie
            },
            payload: {
                name: chance.sentence({words: 5}),
                description: chance.sentence({words: 5})
            }
        };

        Utils.sendRequest(options).then(function(response) {

            Code.expect(response.statusCode).to.equal(200);
            var responsePayload = JSON.parse(response.payload);
            Code.expect(responsePayload.name).to.equal(options.payload.name);
            Code.expect(responsePayload.description).to.equal(options.payload.description);
            done();
        }).catch(function(error) {
            done(error);
        });
    });

    lab.test("Delete Tag", function (done) {
        
        var options = {
            method: "DELETE",
            url: "/api/v1/tag/" + tagId,
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
});