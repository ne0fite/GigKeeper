"use strict";

var GoogleMaps = require("@google/maps");
var Promise = require("bluebird");

var config = require("../../config/config.js");

/**
 * This service encapsulates Google Places functionality.
 * 
 * @return {function}
 */
module.exports = function() {
    const whitelistedElements = ['place_id', 'formatted_address', 'name'];

    var model = {};
    var place = null;

    /**
     * Store a place in the model.
     * 
     * @param  {object} newPlace A Google Place
     * 
     * @return {void}
     */
    model.set = (newPlace) => {
        place = newPlace;
    };

    /**
     * Gets the place stored in the model.
     * 
     * @return {?object}    The Google Place
     */
    model.get = () => {
        return place;
    };

    /**
     * Strips non-whitelisted elements from the place.
     * 
     * @param  {object} dirtyPlace [description]
     * 
     * @return {object} The cleaned place
     */
    model.stripPlace = (dirtyPlace) => {
        var cleanPlace = {};
        var i, elementName;

        for(i = 0; i < whitelistedElements.length; ++i) {
            elementName = whitelistedElements[i];
            cleanPlace[elementName] = typeof dirtyPlace[elementName] == 'undefined' ? null : dirtyPlace[elementName];
        }

        return cleanPlace;
    };

    /**
     * Generate a request for the distance between two Google Places IDs.
     * 
     * @param  {string} originPlaceId    A valid Google Places ID
     * @param  {string} destPlaceId    A valid Google Places ID
     * 
     * @return {object}  The distance request object
     */
    model.distance = (originPlaceId, destPlaceId) => {
        var maps = new GoogleMaps.createClient({
            key: config.google.apiKey,
            Promise: Promise
        });
        
        return maps.distanceMatrix({
            origins: "place_id:" + originPlaceId,
            destinations: "place_id:" + destPlaceId
        });
    };

    /**
     * Serialize the model for database storage.
     * 
     * @return {string} The JSON-encoded model without non-whitelisted elements
     */
    model.toString = () => {
        return JSON.stringify(model.stripPlace(place));
    };

    return model;
};