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

const GoogleMaps = require("@google/maps");
const Promise = require("bluebird");

const config = require("../../config/config.js");

/**
 * This service encapsulates Google Places functionality.
 * 
 * @return {function}
 */
module.exports = function() {
    const whitelistedElements = ["place_id", "formatted_address", "name"];

    var place = null;

    const model = {

        /**
         * Store a place in the model.
         * 
         * @param  {object} newPlace A Google Place
         * 
         * @return {void}
         */
        set: (newPlace) => {
            place = newPlace;
        },

        /**
         * Gets the place stored in the model.
         * 
         * @return {?object}    The Google Place
         */
        get: () => {
            return place;
        },

        /**
         * Strips non-whitelisted elements from the place.
         * 
         * @param  {object} dirtyPlace [description]
         * 
         * @return {object} The cleaned place
         */
        stripPlace: (dirtyPlace) => {
            var cleanPlace = {};
            var i, elementName;

            for(i = 0; i < whitelistedElements.length; ++i) {
                elementName = whitelistedElements[i];
                cleanPlace[elementName] = typeof dirtyPlace[elementName] == "undefined" ? null : dirtyPlace[elementName];
            }

            return cleanPlace;
        },

        /**
         * Generate a request for the distance between two Google Places IDs.
         * 
         * @param  {string} originPlaceId    A valid Google Places ID
         * @param  {string} destPlaceId    A valid Google Places ID
         * 
         * @return {object}  The distance request object
         */
        distance: (originPlaceId, destPlaceId) => {
            var maps = new GoogleMaps.createClient({
                key: config.google.apiKey,
                Promise: Promise
            });
            
            return maps.distanceMatrix({
                origins: "place_id:" + originPlaceId,
                destinations: "place_id:" + destPlaceId
            });
        },

        /**
         * Serialize the model for database storage.
         * 
         * @return {string} The JSON-encoded model without non-whitelisted elements
         */
        toString: () => {
            return JSON.stringify(model.stripPlace(place));
        }
    };

    return model;
};