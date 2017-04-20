"use strict";

var Lab = require("lab");
var lab = exports.lab = Lab.script();
var server = require("../main.js");
var Code = require("code");
var Utils = require("./testUtils.js");

lab.experiment("user", function () {
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

    lab.test("Get Profile", function(done) {
        var options = {
            method: "GET",
            url: "/api/v1/user/profile",
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

    lab.test("Update Profile", function(done) {
        var options = {
            method: "POST",
            url: "/api/v1/user/profile",
            headers: {
                cookie: authCookie
            },
            payload: {
                email: "test@example.com"
            }
        };

        Utils.sendRequest(options).then(function(response) {
            console.log(response.payload);
            Code.expect(response.statusCode).to.equal(200);
            done();
        }).catch(function(error) {
            done(error);
        });
    });


});