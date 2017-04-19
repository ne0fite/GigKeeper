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