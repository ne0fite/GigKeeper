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
    '$scope', '$uibModalInstance', 'NgMap', 'DirectionsResult',
    function($scope, $uibModalInstance, NgMap, DirectionsResult) {
        /**
         * Prepare routes for use with NgMap. Routes with many waypoints are downsampled to 23 (Google's maximum).
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
                var steps = leg.steps.slice(1); //skip the first step, because it begins at the origin

                var stepSize = steps.length <= 23 ? 1 : steps.length / 23;
                var stepIndices = [];
                var i;
                for(i = 0; i <= 23; ++i) {
                    stepIndices.push(parseInt(stepSize * i));
                }

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
                    steps: route.legs[0].steps,
                    waypoints: steps.filter(function (element, index) {
                        return steps.length <= 23 || stepIndices.indexOf(index) != -1;
                    })
                    .map(function (step) {
                        return {
                            location: step.start_location,
                            stopover: false
                        };
                    })
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

        $scope.selection = 0;

        $scope.preparedRoutes = prepareRoutes(DirectionsResult);

        /**
         * Finalize user's selection, and close the modal.
         * 
         * @return {void}
         */
        $scope.ok = function () {
            $uibModalInstance.close(DirectionsResult.routes[$scope.selection]);
        };

        /**
         * Cancel the user's selection, and close the modal.
         * 
         * @return {void}
         */
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

        /**
         * Callback function to work around Google's grey map bug when the map is reused.
         * 
         * @param {object} map The Google Map object
         * 
         * @return {void}
         */
        $scope.mapInitialized = function (map) {
            window.google.maps.event.trigger(map, 'resize');
            map.setCenter($scope.preparedRoutes[$scope.selection].center);
        };
    }
]);