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

var GoogleMaps = require("@google/maps");
var Promise = require("bluebird");

var config = require("../../config/config.js");

/**
 * This service encapsulates Google Directions functionality.
 * 
 * @return {function}
 */
module.exports = function() {
    var model = {};

    /**
     * Generate a request for the directions from one Google Places ID to another.
     * 
     * @param  {string} originPlaceId    A valid Google Places ID
     * @param  {string} destPlaceId    A valid Google Places ID
     * @param  {boolean} alternatives    Request alternative routes? (Default: true)
     * 
     * @return {object}  The distance request object
     */
    model.directions = (originPlaceId, destPlaceId, alternatives = true) => {
        var maps = new GoogleMaps.createClient({
            key: config.google.apiKey,
            Promise: Promise
        });

        return maps.directions({
            origin: "place_id:" + originPlaceId,
            destination: "place_id:" + destPlaceId,
            alternatives: alternatives
        });
    };

    return model;
};