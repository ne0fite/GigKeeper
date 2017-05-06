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
    '$rootScope', 'localStorageService', '$uibModal', '$filter', '$title', '$stateParams', '$state', '$window', 'contractors', 'gig',
    'Contractor', 'Tag', 'Gig', 'UrlBuilder', 'BlockingPromiseManager', 'GoogleMaps', 'dialogs',
    function(
        $rootScope, localStorageService, $uibModal, $filter, $title, $stateParams, $state, $window, contractors, gig,
        Contractor, Tag, Gig, UrlBuilder, BlockingPromiseManager, GoogleMaps, dialogs
    ) {
        var vm = this;

        vm.title = $title;

        vm.tagDropdownOptions = Tag.getDropdownOptions();

        var template = function(gig) {

            var startDate = $window.moment(new Date(gig.startDate)).format('M/D/YYY h:mm a');
            return '<div>' + gig.name + ' @ ' + gig.place.name + ' <span class="small pull-right">' + startDate +
                '</span></div>' + '<div class="small">' + gig.place.formatted_address + '</div>';
        };

        vm.gigDropdownOptions = {
            dataSource: Gig.getDataSource(),
            autoBind: true,
            dataTextField: 'name',
            dataValueField: 'id',
            valuePrimitive: false,
            template: template,
            valueTemplate: template
        };

        /**
         * Update the form based on the user's selected route.
         *
         * @param {object} route A route from the Google Directions API
         *
         * @return {void}
         */
        function selectRoute(route) {
            vm.form.distance = $filter('metersToMiles')(GoogleMaps.calculateRouteDistance(route));
            vm.form.duration = GoogleMaps.calculateRouteDuration(route) / 60; //convert seconds to minutes
        }

        gig.tags = gig.tags ? gig.tags : [];
        vm.form = {
            name: gig.name,
            originType: gig.originType || 'home',
            originPlace: angular.fromJson(gig.originPlace),
            originGig: gig.originGig || null,
            place: angular.fromJson(gig.place),
            distance: gig.distance,
            duration: gig.duration,
            startDate: new Date(gig.startDate),
            endDate: new Date(gig.endDate),
            contractorId: gig.contractorId,
            tags: gig.tags,
            notes: gig.notes
        };

        vm.contractors = contractors;

        vm.descriptionsComboOptions = {
            autoBind: false,
            dataSource: new kendo.data.DataSource({
                transport: {
                    read: {
                        url: UrlBuilder.build('/api/v1/gig/descriptions'),
                        beforeSend: function(req) {
                            var apiToken = localStorageService.get('apiToken');
                            if (apiToken) {
                                req.setRequestHeader('Authorization', 'Bearer ' + apiToken);
                            }
                        }
                    }
                }
            }),
            dataTextField: 'name',
            dataValueField: 'name'
        };

        vm.distanceOptions = {
            decimals: 1,
            min: 0,
            format: 'n1'
        };

        vm.durationOptions = {
            decimals: 0,
            min: 0,
            format: 'n0'
        };

        // don't start watching stuff until the user profile is loaded
        BlockingPromiseManager.then(function () {

            vm.$watch('form.startDate', function(newValue, oldValue) {
                var defaultDuration = $rootScope.user.profile.defaultDuration;

                if (newValue != oldValue && newValue) {
                    if (vm.form.endDate < vm.form.startDate) {
                        vm.form.endDate = vm.form.startDate;
                    }
                    if ($rootScope.user.profile.defaultDuration > 0) {
                        vm.form.endDate = new Date(newValue.getTime() + defaultDuration * 60 * 1000);
                    }
                }

                if(!vm.form.originPlace) {
                    vm.resetOriginPlace();
                }
            });

            vm.$watch('form.endDate', function(newValue, oldValue) {
                if (newValue != oldValue && newValue) {
                    if (vm.form.endDate < vm.form.startDate) {
                        vm.form.startDate = vm.form.endDate;
                    }
                }
            });

            vm.$watch('form.originType', function(newValue, oldValue) {
                if (newValue != oldValue && newValue) {
                    switch (newValue) {
                    case 'home':
                        vm.form.originPlace = $rootScope.user.profile.homeBasePlace;
                        break;
                    case 'gig':
                        if (vm.form.originGig) {
                            vm.form.originPlace = vm.form.originGig.place;
                        }
                        break;
                    case 'other':
                        break;
                    }
                }
            });

            vm.$watch('form.originGig', function(newValue, oldValue) {
                if (newValue != oldValue && newValue) {
                    if (vm.form.originType == 'gig') {
                        vm.form.originPlace = newValue.place;
                    }
                }
            });

            vm.$watch('form.place', function(newValue, oldValue) {
                if (newValue != oldValue && newValue) {
                    vm.form.distance = null;
                    vm.form.duration = null;
                }
            });
        });

        /**
         * Reset the starting location to the user's home base.
         *
         * @return {void}
         */
        vm.resetOriginPlace = function () {
            vm.form.originPlace = $rootScope.user.profile.homeBasePlace;
        };

        /**
         * Estimate the distance to the specified location
         *
         * @param  {object} $event The Angular event object
         *
         * @return {void}
         */
        vm.estimateDistance = function ($event) {
            $event.preventDefault();

            var button = angular.element('#estimate_button');
            button.button('loading');

            var request = GoogleMaps.data.directionsTo({
                fromPlaceId: vm.form.originPlace.place_id,
                toPlaceId: vm.form.place.place_id
            }).$promise
                .then(function(response) {
                    selectRouteDialog(response);
                    button.button('reset');
                }).catch(function(error) { // eslint-disable-line no-unused-vars
                    button.button('reset');
                });

            BlockingPromiseManager.add(request);
        };

        vm.next = function() {

        };

        vm.prev = function() {

        };

        /**
         * Save the gig.
         *
         * @param {object} gigForm The editor's form object
         *
         * @return {void}
         */
        vm.submit = function(gigForm) {

            if (!gigForm.$invalid) {

                var button = angular.element('#save_button');
                button.button('loading');

                var payload = {
                    name: vm.form.name,
                    originType: vm.form.originType,
                    originPlace: vm.form.originPlace,
                    originGigId: vm.form.originGig ? vm.form.originGig.id : null,
                    place: vm.form.place,
                    distance: vm.form.distance,
                    duration: vm.form.duration,
                    startDate: vm.form.startDate,
                    endDate: vm.form.endDate,
                    contractorId: vm.form.contractorId,
                    tags: vm.form.tags,
                    notes: vm.form.notes
                };

                var promise;
                if (gig.id) {
                    promise = Gig.data.update({ id: gig.id }, payload).$promise;
                } else {
                    promise = Gig.data.create({}, payload).$promise;
                }

                promise.then(function() {
                    $state.go('gigs');
                }).catch(function(error) {
                    vm.errorMessage = error.message;
                    button.button('reset');
                });

                BlockingPromiseManager.add(promise);
            } else {
                vm.errorMessage = 'Check form for errors';
            }
        };

        /**
         * Go back to the gig list. Require user confirmation if there are changes.
         *
         * @return {void}
         */
        vm.cancel = function() {
            if(vm.gigForm.$dirty) {
                dialogs.confirm({
                    message: 'Are you sure? Your changes will be lost.'
                }).then(function () {
                    $state.go('gigs');
                });
            }
            else {
                $state.go('gigs');
            }
        };

        /**
         * Open the contractor editor dialog, and refresh the list on success.
         *
         * @param  {object} $event The Angular event object
         *
         * @return {void}
         */
        vm.addContractor = function($event) {
            $event.preventDefault();

            Contractor.editDialog({}).then(function (result) {
                //clean the result to prevent an error
                // delete result.$promise;
                // delete result.$resolved;

                vm.contractors.push(result);
                vm.form.contractorId = result.id;
            }, function() {

            });
        };

        /**
         * Open the tag editor dialog, and refresh the list on success.
         *
         * @param  {object} $event The Angular event object
         *
         * @return {void}
         */
        vm.addTag = function($event) {
            var promise = Tag.editDialog();

            $event.preventDefault();

            promise.then(function (result) {
                //clean the result to prevent an error
                delete result.$promise;
                delete result.$resolved;

                vm.tagDropdownOptions.dataSource.add(result);
                vm.form.tags.push(result);
            }, function() {
                
            });
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
                size: 'xl',
                controller: 'SelectRouteController as vm',
                resolve: {
                    DirectionsResult: function() {
                        return DirectionsResult;
                    }
                }
            });

            modalInstance.result.then(function(route) {
                selectRoute(route);
            });
        }
    }
]);