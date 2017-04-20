(function() {
    'use strict';

    angular.module('GigKeeper').controller('tags', [
        '$scope', '$uibModal', 'dialogs', 'Tag', 'BlockingPromiseManager',
        function($scope, $uibModal, dialogs, Tag, BlockingPromiseManager) {

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

            function editDialog(tag) {
                var modalInstance = $uibModal.open({
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: '/template/tagEdit.html',
                    controller: 'TagEditController',
                    resolve: {
                        tag: function() {
                            return tag;
                        }
                    }
                });

                modalInstance.result.then(function() {
                    load();
                }, function() {

                });
            }
        }
    ]);
})();