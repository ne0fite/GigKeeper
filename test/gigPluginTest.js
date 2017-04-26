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

lab.experiment("gig", function () {
    var authCookie;

    var gigId;
    var testContractorId = "b0b69ef0-2acd-11e7-878e-87d82f0d3cb5";
    var testTagId1 = "c64bfb20-2acd-11e7-878e-87d82f0d3cb5";
    var testTagId2 = "ce7ab520-2acd-11e7-878e-87d82f0d3cb5";

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

    lab.test("Get Gigs", function(done) {
        var options = {
            method: "GET",
            url: "/api/v1/gig",
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

    lab.test("Create Gig", function (done) {
        
        var options = {
            method: "POST",
            url: "/api/v1/gig",
            headers: {
                cookie: authCookie
            },
            payload: {
                name: chance.sentence({words: 5}),
                place: {
                    formatted_address: null,
                    name: null,
                    place_id: null
                },
                distance: chance.floating({min: 0, max: 100, fixed: 2}),
                duration: chance.integer({min: 0, max: 100}),
                startDate: new Date(),
                endDate: new Date(),
                contractorId: testContractorId,
                tags: [{
                    id: testTagId1
                }]
            }
        };

        Utils.sendRequest(options).then(function(response) {
            Code.expect(response.statusCode).to.equal(200);
            var responsePayload = JSON.parse(response.payload);
            gigId = responsePayload.id;
            Code.expect(responsePayload.name).to.equal(options.payload.name);
            Code.expect(responsePayload.place).to.equal(options.payload.place);
            Code.expect(parseFloat(responsePayload.distance)).to.equal(options.payload.distance);
            Code.expect(parseFloat(responsePayload.duration)).to.equal(options.payload.duration);
            Code.expect(new Date(responsePayload.startDate)).to.equal(options.payload.startDate);
            Code.expect(new Date(responsePayload.endDate)).to.equal(options.payload.endDate);
            Code.expect(responsePayload.contractorId).to.equal(options.payload.contractorId);
            done();
        }).catch(function(error) {
            done(error);
        });
    });

    lab.test("Update Gig", function (done) {
        
        var options = {
            method: "POST",
            url: "/api/v1/gig/" + gigId,
            headers: {
                cookie: authCookie
            },
            payload: {
                name: chance.sentence({words: 5}),
                place: {
                    formatted_address: null,
                    name: null,
                    place_id: null
                },
                distance: chance.floating({min: 0, max: 100, fixed: 2}),
                duration: chance.integer({min: 0, max: 100}),
                startDate: new Date(),
                endDate: new Date(),
                contractorId: testContractorId,
                tags: [{
                    id: testTagId1
                }, {
                    id: testTagId2
                }]
            }
        };

        Utils.sendRequest(options).then(function(response) {

            Code.expect(response.statusCode).to.equal(200);
            var responsePayload = JSON.parse(response.payload);
            Code.expect(responsePayload.id).to.equal(gigId);
            Code.expect(responsePayload.name).to.equal(options.payload.name);
            Code.expect(responsePayload.place).to.equal(options.payload.place);
            Code.expect(parseFloat(responsePayload.distance)).to.equal(options.payload.distance);
            Code.expect(parseFloat(responsePayload.duration)).to.equal(options.payload.duration);
            Code.expect(new Date(responsePayload.startDate)).to.equal(options.payload.startDate);
            Code.expect(new Date(responsePayload.endDate)).to.equal(options.payload.endDate);
            Code.expect(responsePayload.contractorId).to.equal(options.payload.contractorId);
            done();
        }).catch(function(error) {
            done(error);
        });
    });

    lab.test("Delete Gig", function (done) {
        
        var options = {
            method: "DELETE",
            url: "/api/v1/gig/" + gigId,
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