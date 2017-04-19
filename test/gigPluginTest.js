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
    var testContractorId = "70ecd040-2114-11e7-beea-0942c23fd4bb";
    var testTagId1 = "e9bb4ee0-2234-11e7-9f58-01b67d31c03c";
    var testTagId2 = "2d8da520-2238-11e7-814e-ff93d6fc09da";

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
                distance: chance.floating({min: 0, max: 100}),
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
            // console.log(response.payload);
            Code.expect(response.statusCode).to.equal(200);
            var responsePayload = JSON.parse(response.payload);
            gigId = responsePayload.id;
            Code.expect(responsePayload.name).to.equal(options.payload.name);
            Code.expect(responsePayload.place).to.equal(options.payload.place);
            Code.expect(responsePayload.distance).to.equal(options.payload.distance);
            Code.expect(responsePayload.duration).to.equal(options.payload.duration);
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
                distance: chance.floating({min: 0, max: 100}),
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
            Code.expect(responsePayload.distance).to.equal(options.payload.distance);
            Code.expect(responsePayload.duration).to.equal(options.payload.duration);
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