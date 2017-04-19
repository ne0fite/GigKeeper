"use strict";

var Lab = require("lab");
var lab = exports.lab = Lab.script();
var server = require("../main.js");
var Code = require("code");
var Chance = require("chance");
var chance = new Chance();
var Utils = require("./testUtils.js");

lab.experiment("settings", function () {
    var authCookie;

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

    lab.test("Get Settings", function(done) {
        var options = {
            method: "GET",
            url: "/api/v1/settings",
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

    lab.test("Update Settings", function (done) {
        
        var options = {
            method: "POST",
            url: "/api/v1/settings",
            headers: {
                cookie: authCookie
            },
            payload: {
                homeBasePlace: {},
                defaultDuration: chance.integer({ min: 0, max: 120 })
            }
        };

        Utils.sendRequest(options).then(function(response) {
            // console.log(response.payload);
            Code.expect(response.statusCode).to.equal(200);
            done();
        }).catch(function(error) {
            done(error);
        });
    });
});