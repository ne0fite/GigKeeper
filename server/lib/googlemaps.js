"use strict";

var Promise = require("bluebird");
var qs = require("qs");
var request = require("request");

module.exports = GoogleMaps;

function GoogleMaps(apiKey) {
    this.apiKey = apiKey;
}

GoogleMaps.prototype.getDistance = function(origin, destination) {
    var maps = this;

    var params = {
        origins: "place_id:" + origin.place_id,
        destinations: "place_id:" + destination.place_id,
        key: maps.apiKey
    };

    var url = "https://maps.googleapis.com/maps/api/distancematrix/json?" + qs.stringify(params);

    console.log(url);
    return new Promise(function(resolve, reject) {
        request(url, function (error, response, body) {
            if (error) {
                reject(new Error(error));
            } else {
                resolve(JSON.parse(body));
            }
        });
    });
};

GoogleMaps.prototype.getDistanceTo = function(origin, placeId) {
    var maps = this;

    var params = {
        origins: "place_id:" + origin.place_id,
        destinations: "place_id:" + placeId,
        key: maps.apiKey
    };

    var url = "https://maps.googleapis.com/maps/api/distancematrix/json?" + qs.stringify(params);

    console.log(url);
    return new Promise(function(resolve, reject) {
        request(url, function (error, response, body) {
            if (error) {
                reject(new Error(error));
            } else {
                resolve(JSON.parse(body));
            }
        });
    });
};