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