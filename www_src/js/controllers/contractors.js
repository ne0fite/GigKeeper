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

angular.module('GigKeeper').controller('contractors', [
    '$scope', '$window', '$uibModal', 'dialogs', 'Contractor', 'BlockingPromiseManager',
    function($scope, $window, $uibModal, dialogs, Contractor, BlockingPromiseManager) {

        $scope.selected = null;

        $scope.gridOptions = {
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
            var request = Contractor.data.index().$promise.then(function(contractors) {
                $scope.gridOptions.data = contractors;
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
            editDialog({});
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

            editDialog($scope.selected.entity);
        };

        $scope.deleteSelected = function() {
            dialogs.confirm({
                okText: 'Delete',
                title: 'Confirm Delete',
                message: 'Are you sure you want to delete ' + $scope.selected.entity.name + '?'
            }).then(function() {
                var request = Contractor.data.delete({ id: $scope.selected.entity.id }).$promise.then(function() {
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

        function editDialog(contractor) {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: '/template/dialogs/contractorEdit.html',
                controller: 'ContractorEditController',
                resolve: {
                    contractor: function() {
                        return contractor;
                    }
                }
            });

            modalInstance.result.then(function() {
                load();
            }, function() {

            });
        }

        /**
         * Export the user's contractors.
         *
         * @return {void}
         */
        $scope.export = function () {
            Contractor.data.export().$promise.then(function (result) {
                $window.saveAs(result.blob, result.filename);
            }).catch(function(error) {
                $scope.alerts.push({
                    msg: error.message,
                    type: 'danger'
                });
            });
        };
    }
]);