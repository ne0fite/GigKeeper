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
    '$window', '$uibModal', 'dialogs', 'Contractor', 'BlockingPromiseManager',
    function($window, $uibModal, dialogs, Contractor, BlockingPromiseManager) {

        var vm = this;

        vm.selected = null;

        vm.gridOptions = {
            enableRowSelection: true,
            enableSelectAll: false,
            multiSelect: false,
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
            }
        };

        function load() {
            var request = Contractor.data.index().$promise.then(function(contractors) {
                vm.gridOptions.data = contractors;
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