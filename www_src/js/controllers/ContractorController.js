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

angular.module('GigKeeper').controller('ContractorController', [
    '$window', 'dialogs', 'Contractor', 'BlockingPromiseManager',
    function($window, dialogs, Contractor, BlockingPromiseManager) {

        var vm = this;

        vm.selected = null;

        vm.gridOptions = {
            enableRowSelection: true,
            enableSelectAll: false,
            multiSelect: false,
            paginationPageSize: 10,
            paginationPageSizes: [10, 25, 50, 100],
            useExternalPagination: true,
            useExternalSorting: true,
            enableRowHeaderSelection: false,
            enableSorting: true,
            noUnselect: true,
            columnDefs: [{
                name: 'Name',
                field: 'name',
                type: 'string'
            }, {
                name: 'Contact',
                field: 'contact',
                type: 'string'
            }, {
                name: 'Phone',
                field: 'phone',
                type: 'string'
            }, {
                name: 'Email',
                field: 'email',
                type: 'string'
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

                gridApi.core.on.sortChanged(null, function(grid, sortColumns) {
                    if (sortColumns.length === 0) {
                        paginationOptions.sort = null;
                    } else {
                        paginationOptions.sort = sortColumns.map(function(sortColumn) {
                            return {
                                field: sortColumn.field,
                                dir: sortColumn.sort.direction
                            };
                        });
                    }
                    load();
                });

                gridApi.pagination.on.paginationChanged(null, function(newPage, pageSize) {
                    paginationOptions.offset = pageSize * (newPage - 1);
                    paginationOptions.limit = pageSize;
                    load();
                });                
            }
        };

        var paginationOptions = {
            offset: 0,
            limit: 10,
            sort: null
        };

        function load() {
            var query = Object.assign({}, paginationOptions);
            var request = Contractor.data.index(query).$promise.then(function(result) {
                vm.gridOptions.totalItems = result.totalRows;
                vm.gridOptions.data = result.data;
            });

            BlockingPromiseManager.add(request);
        }

        load();

        vm.add = function() {
            editDialog({});
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

            editDialog(vm.selected.entity);
        };

        vm.deleteSelected = function() {
            dialogs.confirm({
                okText: 'Delete',
                title: 'Confirm Delete',
                message: 'Are you sure you want to delete ' + vm.selected.entity.name + '?'
            }).then(function() {
                var request = Contractor.data.delete({ id: vm.selected.entity.id }).$promise.then(function() {
                    vm.selected = null;
                    load();
                });

                BlockingPromiseManager.add(request);
            }, function() {

            });
        };

        function editDialog(contractor) {
            Contractor.editDialog(contractor).then(function() {
                load();
            }, function() {

            });
        }

        /**
         * Export the user's contractors.
         *
         * @return {void}
         */
        vm.export = function () {
            Contractor.data.export().$promise.then(function (result) {
                $window.saveAs(result.blob, result.filename);
            });
        };
    }
]);