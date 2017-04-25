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
    '$scope', '$uibModalInstance', 'DirectionsResult',
    function($scope, $uibModalInstance, DirectionsResult) {
        function prepareRoutes(DirectionsResult) {
            var DirectionsResults = splitDirectionsResult(DirectionsResult);

            return DirectionsResults.map(function (DirectionsResult) {
                var route = DirectionsResult.routes[0];
                var leg = route.legs[0];
                var steps = leg.steps.slice(1); //skip the first step, because it begins at the origin

                return {
                    summary: route.summary,
                    origin: leg.start_location,
                    destination: leg.end_location,
                    waypoints: steps.map(function (step) {
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

        $scope.ok = function () {
            $uibModalInstance.close(DirectionsResult.routes[$scope.selection]);
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);