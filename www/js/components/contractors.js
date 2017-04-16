(function() {
    'use strict';

    angular.module('GigKeeper').component('contractors', {
        templateUrl: 'contractors.html',
        controller: function($scope, $uibModal, dialogs, Contractor) {

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
                Contractor.data.index().$promise.then(function(contractors) {
                    $scope.gridOptions.data = contractors;
                }).catch(function(err) {
                    console.error(err);
                });
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
                    Contractor.data.delete({ id: $scope.selected.entity.id }).$promise.then(function() {
                        load();
                    }).catch(function(error) {
                        console.error(error);
                    });
                }, function() {

                });
            };

            function editDialog(contractor) {
                var modalInstance = $uibModal.open({
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: '/contractorEdit.html',
                    controller: 'ContractorEditController',
                    //controllerAs: '$ctrl',
                    //size: size,
                    //appendTo: parentElem,
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
    });

    angular.module('GigKeeper').controller('ContractorEditController', [
        '$scope', '$uibModalInstance', 'Contractor', 'contractor',
        function($scope, $uibModalInstance, Contractor, contractor) {

            $scope.form = {
                id: contractor.id,
                name: contractor.name,
                address1: contractor.address1,
                address2: contractor.address2,
                city: contractor.city,
                region: contractor.region,
                postalCode: contractor.postalCode,
                phone: contractor.phone,
                email: contractor.email,
                web: contractor.web
            };

            $scope.submit = function(contractorForm) {

                if (!contractorForm.$invalid) {

                    var button = angular.element('#save_button');
                    button.button('loading');

                    var payload = {
                        name: $scope.form.name,
                        address1: $scope.form.address1,
                        address2: $scope.form.address2,
                        city: $scope.form.city,
                        region: $scope.form.region,
                        postalCode: $scope.form.postalCode,
                        phone: $scope.form.phone,
                        email: $scope.form.email,
                        web: $scope.form.web
                    };

                    var promise;
                    if (contractor.id) {
                        promise = Contractor.data.update({ id: contractor.id }, payload).$promise;
                    } else {
                        promise = Contractor.data.create({}, payload).$promise;
                    }

                    promise.then(function() {
                        $uibModalInstance.close();
                        button.button('reset');
                    }).catch(function(error) {
                        $scope.errorMessage = error.message;
                        button.button('reset');
                    });
                } else {
                    $scope.errorMessage = 'Check form for errors';
                }
            };

            $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };
        }
    ]);
})();