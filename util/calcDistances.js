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

var sqlizr = require("sqlizr");
var Sequelize = require("sequelize");
var Promise = require("bluebird");
var GoogleMaps = require("../server/lib/googlemaps.js");

var modelPath = __dirname + "/../server/models/*.js";

var config = require("../config/config.json");

var sequelizeOptions = {
    dialect: config.db.dialect,
    host: config.db.host,
    port: config.db.port,
    benchmark: true
};

var sequelize = new Sequelize(config.db.name, config.db.user, config.db.pass, sequelizeOptions);

var db = sqlizr(sequelize, modelPath);

var maps = new GoogleMaps(config.google.apiKey);

var gigOptions = {
    include: [{
        model: db.profile,
        required: true
    }]
};

db.gig.findAll(gigOptions).then(function(gigs) {
    return Promise.each(gigs, function(gig) {
        if (gig.profile.homeBasePlace && gig.place) {
            return maps.getDistance(gig.profile.homeBasePlace, gig.place).then(function(response) {
                
                var element = response.rows[0].elements[0];

                var payload = {
                    // convert KM to miles
                    distance: element.distance.value / 1000 / 1.609344,

                    // convert seconds to minutes
                    duration: element.duration.value / 60
                };

                return gig.update(payload);
            });
        } else {
            console.log("Missing origin / destination places");
        }
    });
}).then(function() {
    console.log("Done!");
}).catch(function(error) {
    console.error(error);
}).finally(function() {
    process.exit(0);
});