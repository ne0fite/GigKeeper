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

'use strict';

angular.module('GigKeeper').factory('GoogleMaps', [
    '$resource', 'UrlBuilder',
    function($resource, UrlBuilder) {
        var service = {};

        service.data = $resource(UrlBuilder.build('/api/v1/map'), {}, {
            distanceTo: {
                action: 'distanceTo',
                method: 'GET',
                url: UrlBuilder.build('/api/v1/map/distance/:fromPlaceId/:toPlaceId')
            },
            directionsTo: {
                action: 'directionsTo',
                method: 'GET',
                url: UrlBuilder.build('/api/v1/map/directions/:fromPlaceId/:toPlaceId')
            }
        });

        /**
         * Calculate a route's distance.
         *
         * @param {object} route A route from the Google Directions API
         *
         * @return {number} The route's distance in meters
         */
        service.calculateRouteDistance = function (route) {
            return route.legs.reduce(function (accumulator, leg) {
                return accumulator + leg.steps.reduce(function (stepAccumulator, step) {
                    return stepAccumulator + step.distance.value;
                }, 0);
            }, 0);
        };

        /**
         * Calculate a route's travel time.
         *
         * @param {object} route A route from the Google Directions API
         *
         * @return {number} The route's travel time in seconds
         */
        service.calculateRouteDuration = function (route) {
            return route.legs.reduce(function (accumulator, leg) {
                return accumulator + leg.steps.reduce(function (stepAccumulator, step) {
                    return stepAccumulator + step.duration.value;
                }, 0);
            }, 0);
        };

        return service;
    }
]);