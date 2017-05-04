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
var Code = require("code");
var Chance = require("chance");
var chance = new Chance();
var Security = require("../server/lib/security.js");

lab.experiment("security", function () {
    var security = new Security();

    lab.test("JWT Options", function(done) {
        let jwtOptions = security.getJwtOptions();
        done();
    });

    lab.test("Validate User", function(done) {
        security.getValidatedUser("test@example.com", "123123").then(function(user) {
            done();
        }).catch(function(error) {
            done(error);
        })
    });
});