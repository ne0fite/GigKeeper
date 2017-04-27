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

angular.module('GigKeeper').controller('gigs', [
    '$scope', '$state', 'uiGridConstants', 'dialogs', 'contractors', 'Gig', 'UrlBuilder',
    'BlockingPromiseManager',
    function(
        $scope, $state, uiGridConstants, dialogs, contractors, Gig, UrlBuilder,
        BlockingPromiseManager
    ) {

        $scope.selected = null;

        $scope.gridOptions = {
            enableFiltering: true,
            enableRowHeaderSelection: false,
            enableRowSelection: true,
            enableSelectAll: false,
            enableSorting: true,
            multiSelect: false,
            paginationPageSize: 10,
            paginationPageSizes: [10, 25, 50, 100],
            showColumnFooter: true,
            showGridFooter: true,
            noUnselect: true,
            columnDefs: [{
                name: 'Contractor',
                field: 'contractor.name',
                type: 'string',
                filter: {
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: contractors.map(function(contractor) {
                        return {
                            value: contractor.name,
                            label: contractor.name
                        };
                    })
                }
            }, {
                name: 'Description',
                field: 'name',
                type: 'string'
            }, {
                name: 'Location',
                field: 'place.name',
                type: 'string'
            }, {
                name: 'Distance',
                field: 'distance',
                type: 'string',
                cellFilter: 'number:1',
                footerCellFilter: 'number:1',
                cellClass: 'text-right',
                footerCellClass: 'text-right',
                aggregationHideLabel: true,
                aggregationType: uiGridConstants.aggregationTypes.sum
            }, {
                name: 'Travel Time',
                field: 'duration',
                type: 'number',
                cellFilter: 'number:0',
                footerCellFilter: 'number:0',
                cellClass: 'text-right',
                footerCellClass: 'text-right',
                aggregationHideLabel: true,
                aggregationType: uiGridConstants.aggregationTypes.sum
            }, {
                name: 'Start',
                field: 'startDate',
                type: 'date',
                cellFilter: 'date:"MM/dd/yyyy hh:mm a"'
            }, {
                name: 'End',
                field: 'endDate',
                type: 'date',
                cellFilter: 'date:"MM/dd/yyyy hh:mm a"'
            }],
            data: [],
            onRegisterApi: function(gridApi) {
                gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                    if (row.isSelected) {
                        $scope.selected = row;
                    } else {
                        $scope.selected = null;
                    }
                });
            }
        };

        $scope.selected = null;

        function load() {
            var request = Gig.data.index().$promise.then(function(gigs) {
                $scope.gridOptions.data = gigs;
            }).catch(function(err) {
                $scope.alerts.push({
                    msg: err.message,
                    type: 'danger'
                });
            });

            BlockingPromiseManager.add(request);
        }

        load();

        $scope.add = function() {
            $state.go('addGig');
        };

        /**
         * Edit the selected UI Grid row.
         * 
         * @param {object} [$event] Angular event
         * 
         * @return {void}
         */
        $scope.editSelected = function($event) {
            if($event) {
                if($event.target.closest('[ui-grid-row]').length === 0) {
                    return;
                }
            }

            $state.go('editGig', {id:$scope.selected.entity.id});
        };

        $scope.deleteSelected = function() {
            dialogs.confirm({
                okText: 'Delete',
                title: 'Confirm Delete',
                message: 'Are you sure you want to delete ' + $scope.selected.entity.name + '?'
            }).then(function() {
                var request = Gig.data.delete({ id: $scope.selected.entity.id }).$promise.then(function() {
                    $scope.selected = null;
                    load();
                }).catch(function(error) {
                    $scope.alerts.push({
                        msg: error.message,
                        type: 'danger'
                    });
                });

                BlockingPromiseManager.add(request);
            }, function() {

            });
        };
    }
]);