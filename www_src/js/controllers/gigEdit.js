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

angular.module('GigKeeper').controller('GigEditController', [
    '$rootScope', '$scope', '$uibModalInstance', '$uibModal', 'contractors', 'Tag', 'Gig', 'gig', 'UrlBuilder',
    'BlockingPromiseManager', 'GoogleMaps',
    function(
        $rootScope, $scope, $uibModalInstance, $uibModal, contractors, Tag, Gig, gig, UrlBuilder,
        BlockingPromiseManager, GoogleMaps
    ) {

        function loadTags() {
            $scope.tagDropdownOptions = Tag.getDropdownOptions();
        }

        /**
         * Calculate a route's distance.
         * 
         * @param {object} route A route from the Google Directions API
         * 
         * @return {number} The route's distance in meters
         */
        function calculateDistance(route) {
            return route.legs[0].steps.reduce(function (accumulator, step) {
                return accumulator + step.distance.value;
            }, 0);
        }

        /**
         * Calculate a route's travel time.
         * 
         * @param {object} route A route from the Google Directions API
         * 
         * @return {number} The route's travel time in seconds
         */
        function calculateTravelTime(route) {
            return route.legs[0].steps.reduce(function (accumulator, step) {
                return accumulator + step.duration.value;
            }, 0);
        }

        /**
         * Update the form based on the user's selected route.
         * 
         * @param {object} route A route from the Google Directions API
         * 
         * @return {void}
         */
        function selectRoute(route) {
            $scope.form.distance = calculateDistance(route) / 1000 / 1.609344; //convert KM to miles
            $scope.form.duration = calculateTravelTime(route) / 60; //convert seconds to minutes
        }

        $scope.contractors = contractors;

        $scope.descriptionsComboOptions = {
            autoBind: false,
            dataSource: new kendo.data.DataSource({
                transport: {
                    read: {
                        url: UrlBuilder.build('/api/v1/gig/descriptions')
                    }
                }
            }),
            dataTextField: 'name',
            dataValueField: 'name'
        };

        $scope.distanceOptions = {
            decimals: 1,
            min: 0,
            format: 'n1'
        };

        $scope.durationOptions = {
            decimals: 0,
            min: 0,
            format: 'n0'
        };

        gig.tags = gig.tags ? gig.tags : [];
        $scope.form = {
            name: gig.name,
            place: angular.fromJson(gig.place),
            distance: gig.distance,
            duration: gig.duration,
            startDate: new Date(gig.startDate),
            endDate: new Date(gig.endDate),
            contractorId: gig.contractorId,
            tags: gig.tags,
            notes: gig.notes
        };

        $scope.$watch('form.startDate', function(newValue, oldValue) {
            if (newValue != oldValue && newValue) {
                if ($scope.form.endDate < $scope.form.startDate) {
                    $scope.form.endDate = $scope.form.startDate;
                }
                if ($rootScope.profile.profile.defaultDuration > 0) {
                    $scope.form.endDate = new Date(newValue.getTime() + ($rootScope.profile.profile.defaultDuration * 60 * 1000));
                }
            }
        });

        $scope.$watch('form.endDate', function(newValue, oldValue) {
            if (newValue != oldValue && newValue) {
                if ($scope.form.endDate < $scope.form.startDate) {
                    $scope.form.startDate = $scope.form.endDate;
                }
            }
        });

        /**
         * Estimate the distance to the specified location
         * 
         * @param  {object} $event The Angular event object
         * 
         * @return {void}
         */
        $scope.estimateDistance = function ($event) {
            $event.preventDefault();

            var button = angular.element('#estimate_button');
            button.button('loading');
            
            var request = GoogleMaps.data.directionsTo({placeId: $scope.form.place.place_id}).$promise
                .then(function(response) {
                    selectRouteDialog(response);
                    button.button('reset');
                }).catch(function(error) { // eslint-disable-line no-unused-vars
                    button.button('reset');
                });

            BlockingPromiseManager.add(request);
        };

        $scope.next = function() {

        };

        $scope.prev = function() {

        };

        $scope.submit = function(gigForm) {

            if (!gigForm.$invalid) {

                var button = angular.element('#save_button');
                button.button('loading');

                var payload = {
                    name: $scope.form.name,
                    place: $scope.form.place,
                    distance: $scope.form.distance,
                    duration: $scope.form.duration,
                    startDate: $scope.form.startDate,
                    endDate: $scope.form.endDate,
                    contractorId: $scope.form.contractorId,
                    tags: $scope.form.tags,
                    notes: $scope.form.notes
                };

                var promise;
                if (gig.id) {
                    promise = Gig.data.update({ id: gig.id }, payload).$promise;
                } else {
                    promise = Gig.data.create({}, payload).$promise;
                }

                promise.then(function() {
                    $uibModalInstance.close();
                    button.button('reset');
                }).catch(function(error) {
                    $scope.errorMessage = error.message;
                    button.button('reset');
                });

                BlockingPromiseManager.add(promise);
            } else {
                $scope.errorMessage = 'Check form for errors';
            }
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
        
        /**
         * Open the tag editor dialog, and refresh the list on success.
         * 
         * @param  {object} $event The Angular event object
         * 
         * @return {void}
         */
        $scope.addTag = function($event) {
            var promise = Tag.editDialog();

            $event.preventDefault();

            promise.then(
                function (result) {
                    //clean the result to prevent an error
                    delete result.$promise;
                    delete result.$resolved;
                    
                    $scope.tagDropdownOptions.dataSource.add(result);
                    $scope.form.tags.push(result);
                },
                function () {}
            );
        };

        /**
         * Open a dialog that allows the user to select a route.
         * 
         * @param {object} DirectionsResult The result of a successful request to the Google Directions API
         * 
         * @return {void}
         */
        function selectRouteDialog(DirectionsResult) {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: '/template/dialogs/selectRoute.html',
                size: 'lg',
                controller: 'SelectRouteController',
                resolve: {
                    DirectionsResult: function() {
                        return DirectionsResult;
                    }
                }
            });

            modalInstance.result.then(function(route) {
                selectRoute(route);
            }, function() {

            });
        }



        loadTags();
    }
]);  