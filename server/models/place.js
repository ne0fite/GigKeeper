"use strict";

/**
 * This model encapsulates Google Places functionality.
 * 
 * @return {function}
 */
module.exports = function() {
    const whitelistedElements = ['place_id', 'adr_address'];

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
     * Serialize the model for database storage.
     * 
     * @return {string} The JSON-encoded model without non-whitelisted elements
     */
    model.toString = () => {
        return JSON.stringify(model.stripPlace(place));
    };

    return model;
};