(function() {
    'use strict';

    angular.module('GigKeeper').controller('contractors', [
        '$scope', '$uibModal', 'dialogs', 'Contractor', 'BlockingPromiseManager',
        function($scope, $uibModal, dialogs, Contractor, BlockingPromiseManager) {

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
                    var request = Contractor.data.delete({ id: $scope.selected.entity.id }).$promise.then(function() {
                        load();
                    }).catch(function(error) {
                        console.error(error);
                    });

                    BlockingPromiseManager.add(request);
                }, function() {

                });
            };

            function editDialog(contractor) {
                var modalInstance = $uibModal.open({
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: '/template/contractorEdit.html',
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
        }
    ]);
})();