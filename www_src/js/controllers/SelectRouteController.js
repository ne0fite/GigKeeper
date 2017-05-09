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

angular.module('GigKeeper').controller('SelectRouteController', [
    '$window', '$uibModalInstance', 'NgMap', 'GoogleMaps', 'DirectionsResult',
    function($window, $uibModalInstance, NgMap, GoogleMaps, DirectionsResult) {

        var vm = this;

        /**
         * Prepare routes for use with NgMap.
         * 
         * @param {object} DirectionsResult A Google Maps DirectionsResult
         * 
         * @return {object[]} The preprocessed routes
         */
        function prepareRoutes(DirectionsResult) {
            var DirectionsResults = splitDirectionsResult(DirectionsResult);

            return DirectionsResults.map(function (DirectionsResult) {
                var route = DirectionsResult.routes[0];
                var leg = route.legs[0];
                var steps = leg.steps;

                return {
                    summary: route.summary,
                    origin: leg.start_location,
                    destination: leg.end_location,
                    bounds: {
                        ne: route.bounds.northeast,
                        sw: route.bounds.southwest
                    },
                    center: {
                        lat: (leg.start_location.lat + leg.end_location.lat) / 2,
                        lng: (leg.start_location.lng + leg.end_location.lng) / 2
                    },
                    steps: steps,
                    distance: GoogleMaps.calculateRouteDistance(route),
                    travelTime: GoogleMaps.calculateRouteDuration(route),
                    waypoints: buildWaypoints(steps)
                };
            });
        }

        /**
         * Build waypoints from a set of steps. Routes with too many waypoints are downsampled to 23 (Google's maximum).
         * 
         * @param {object[]} steps A route's steps
         * 
         * @return {object[]} Waypoints
         */
        function buildWaypoints(steps) {
            var stepSize = (steps.length - 1) <= 23 ? 1 : (steps.length - 1) / 23;
            var stepIndices = [];
            var i;
            for(i = 0; i <= 23; ++i) {
                stepIndices.push(parseInt(stepSize * i));
            }

            return steps.slice(1)
                .filter(function (element, index) {
                    return steps.length <= 23 || stepIndices.indexOf(index) != -1;
                })
                .map(function (step) {
                    return {
                        location: step.start_location,
                        stopover: false
                    };
                });
        }

        /**
         * Splits a DirectionsResult into multiple DirectionsResults, each having exactly one route.
         * 
         * @param {object} DirectionsResult The result of a successful request to the Google Directions API
         * 
         * @return {object[]} One route per DirectionsResult
         */
        function splitDirectionsResult(DirectionsResult) {
            return DirectionsResult.routes.map(function (route) {
                var newResult = JSON.parse(JSON.stringify(DirectionsResult));   //deep copy the original

                newResult.routes = [route];

                return newResult;
            });
        }

        vm.preparedRoutes = prepareRoutes(DirectionsResult);

        /**
         * Finalize user's selection, and close the modal.
         * 
         * @return {void}
         */
        vm.ok = function (selection) {
            $uibModalInstance.close(DirectionsResult.routes[selection]);
        };

        /**
         * Cancel the user's selection, and close the modal.
         * 
         * @return {void}
         */
        vm.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

        /**
         * Callback function to work around Google's grey map bug when the map is reused.
         * 
         * @param {object} map The Google Map object
         * 
         * @return {void}
         */
        vm.mapInitialized = function (map) {
            $window.google.maps.event.trigger(map, 'resize');
            map.setCenter(vm.preparedRoutes[0].center);
        };
    }
]);