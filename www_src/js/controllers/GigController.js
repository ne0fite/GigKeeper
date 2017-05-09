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

angular.module('GigKeeper').controller('GigController', [
    '$state', '$window', 'uiGridConstants', 'dialogs', 'contractors', 'Gig', 'BlockingPromiseManager',
    function(
        $state, $window, uiGridConstants, dialogs, contractors, Gig, BlockingPromiseManager
    ) {
        var vm = this;

        vm.selected = null;

        vm.gridOptions = {
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
                name: 'Description',
                field: 'name',
                type: 'string'
            }, {
                name: 'Location',
                field: 'place.name',
                type: 'string'
            }, {
                name: 'Distance / Travel Time',
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
            }, {
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
            }],
            data: [],
            onRegisterApi: function(gridApi) {
                gridApi.selection.on.rowSelectionChanged(null, function(row) {
                    if (row.isSelected) {
                        vm.selected = row;
                    } else {
                        vm.selected = null;
                    }
                });
            }
        };

        vm.selected = null;

        function load() {
            var request = Gig.data.index().$promise.then(function(gigs) {
                vm.gridOptions.data = gigs;
            });

            BlockingPromiseManager.add(request);
        }

        load();

        vm.add = function() {
            $state.go('addGig');
        };

        /**
         * Edit the selected UI Grid row.
         *
         * @param {object} [$event] Angular event
         *
         * @return {void}
         */
        vm.editSelected = function($event) {
            if($event) {
                if($event.target.closest('[ui-grid-row]').length === 0) {
                    return;
                }
            }

            $state.go('editGig', {id:vm.selected.entity.id});
        };

        vm.deleteSelected = function() {
            dialogs.confirm({
                okText: 'Delete',
                title: 'Confirm Delete',
                message: 'Are you sure you want to delete ' + vm.selected.entity.name + '?'
            }).then(function() {
                var request = Gig.data.delete({ id: vm.selected.entity.id }).$promise.then(function() {
                    vm.selected = null;
                    load();
                });

                BlockingPromiseManager.add(request);
            }, function() {

            });
        };

        /**
         * Export the user's gigs.
         *
         * @return {void}
         */
        vm.export = function () {
            Gig.data.export().$promise.then(function (result) {
                $window.saveAs(result.blob, result.filename);
            });
        };
    }
]);