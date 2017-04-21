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

angular.module('GigKeeper').controller('tags', [
    '$scope', 'dialogs', 'Tag', 'BlockingPromiseManager',
    function($scope, dialogs, Tag, BlockingPromiseManager) {

        $scope.selected = null;

        $scope.gridOptions = {
            enableRowSelection: true,
            enableSelectAll: false,
            multiSelect: false,
            enableRowHeaderSelection: false,
            enableSorting: true,
            columnDefs: [{
                name: 'Name',
                field: 'name',
                type: 'string'
            }, {
                name: 'Description',
                field: 'description'
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
            var request = Tag.data.index().$promise.then(function(tags) {
                $scope.gridOptions.data = tags;
            }).catch(function(err) {
                console.error(err);
            });

            BlockingPromiseManager.add(request);
        }

        load();

        $scope.add = function() {
            editDialog({});
        };

        $scope.editSelected = function() {
            editDialog($scope.selected.entity);
        };

        $scope.deleteSelected = function() {
            dialogs.confirm({
                okText: 'Delete',
                title: 'Confirm Delete',
                message: 'Are you sure you want to delete ' + $scope.selected.entity.name + '?'
            }).then(function() {
                var request = Tag.data.delete({ id: $scope.selected.entity.id }).$promise.then(function() {
                    load();
                }).catch(function(error) {
                    console.error(error);
                });

                BlockingPromiseManager.add(request);
            }, function() {

            });
        };

        /**
         * Open the tag editor dialog, and refresh the list on success.
         * 
         * @param {object} [tag] A tag object
         * 
         * @return {void}
         */
        function editDialog(tag) {
            Tag.editDialog(tag).then(
                function(result) {
                    load();
                },
                function() {}
            );
        }
    }
]);