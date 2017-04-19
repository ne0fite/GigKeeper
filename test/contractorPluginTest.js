"use strict";

var Lab = require("lab");
var lab = exports.lab = Lab.script();
var server = require("../main.js");
var Code = require("code");
var Chance = require("chance");
var chance = new Chance();
var Utils = require("./testUtils.js");

lab.experiment("contractor", function () {
    var authCookie;

    var contactId;

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

    lab.test("Get Contractors", function(done) {
        var options = {
            method: "GET",
            url: "/api/v1/contractor",
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

    lab.test("Create Contractor", function (done) {
        
        var options = {
            method: "POST",
            url: "/api/v1/contractor",
            headers: {
                cookie: authCookie
            },
            payload: {
                name: chance.sentence({words: 5}),
                contact: chance.sentence({words: 5}),
                address1: chance.address(),
                address2: chance.sentence({words: 2}),
                city: chance.city(),
                region: chance.state(),
                postalCode: chance.zip(),
                phone: chance.phone(),
                email: chance.email(),
                web: chance.url()
            }
        };

        Utils.sendRequest(options).then(function(response) {
            // console.log(response.payload);
            Code.expect(response.statusCode).to.equal(200);
            var responsePayload = JSON.parse(response.payload);
            contactId = responsePayload.id;
            Code.expect(responsePayload.name).to.equal(options.payload.name);
            Code.expect(responsePayload.contact).to.equal(options.payload.contact);
            Code.expect(responsePayload.address1).to.equal(options.payload.address1);
            Code.expect(responsePayload.address2).to.equal(options.payload.address2);
            Code.expect(responsePayload.city).to.equal(options.payload.city);
            Code.expect(responsePayload.region).to.equal(options.payload.region);
            Code.expect(responsePayload.postalCode).to.equal(options.payload.postalCode);
            Code.expect(responsePayload.phone).to.equal(options.payload.phone);
            Code.expect(responsePayload.email).to.equal(options.payload.email);
            Code.expect(responsePayload.web).to.equal(options.payload.web);
            done();
        }).catch(function(error) {
            done(error);
        });
    });

    lab.test("Update Contractor", function (done) {
        
        var options = {
            method: "POST",
            url: "/api/v1/contractor/" + contactId,
            headers: {
                cookie: authCookie
            },
            payload: {
                name: chance.sentence({words: 5}),
                contact: chance.sentence({words: 5}),
                address1: chance.address(),
                address2: chance.sentence({words: 2}),
                city: chance.city(),
                region: chance.state(),
                postalCode: chance.zip(),
                phone: chance.phone(),
                email: chance.email(),
                web: chance.url()
            }
        };

        Utils.sendRequest(options).then(function(response) {

            Code.expect(response.statusCode).to.equal(200);
            var responsePayload = JSON.parse(response.payload);
            Code.expect(responsePayload.name).to.equal(options.payload.name);
            Code.expect(responsePayload.contact).to.equal(options.payload.contact);
            Code.expect(responsePayload.address1).to.equal(options.payload.address1);
            Code.expect(responsePayload.address2).to.equal(options.payload.address2);
            Code.expect(responsePayload.city).to.equal(options.payload.city);
            Code.expect(responsePayload.region).to.equal(options.payload.region);
            Code.expect(responsePayload.postalCode).to.equal(options.payload.postalCode);
            Code.expect(responsePayload.phone).to.equal(options.payload.phone);
            Code.expect(responsePayload.email).to.equal(options.payload.email);
            Code.expect(responsePayload.web).to.equal(options.payload.web);
            done();
        }).catch(function(error) {
            done(error);
        });
    });

    lab.test("Delete Contractor", function (done) {
        
        var options = {
            method: "DELETE",
            url: "/api/v1/contractor/" + contactId,
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