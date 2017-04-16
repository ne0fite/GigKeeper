(function() {
    'use strict';

    angular.module('GigKeeper').component('tags', {
        templateUrl: 'tags.html',
        controller: function($scope, $uibModal, dialogs, Tag) {

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
                Tag.data.index().$promise.then(function(tags) {
                    $scope.gridOptions.data = tags;
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
                    Tag.data.delete({ id: $scope.selected.entity.id }).$promise.then(function() {
                        load();
                    }).catch(function(error) {
                        console.error(error);
                    });
                }, function() {

                });
            };

            function editDialog(tag) {
                var modalInstance = $uibModal.open({
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: '/tagEdit.html',
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
    });

    angular.module('GigKeeper').controller('TagEditController', [
        '$scope', '$uibModalInstance', 'Tag', 'tag',
        function($scope, $uibModalInstance, Tag, tag) {

            $scope.form = {
                id: tag.id,
                name: tag.name,
                description: tag.description
            };

            $scope.submit = function(tagForm) {

                if (!tagForm.$invalid) {

                    var button = angular.element('#save_button');
                    button.button('loading');

                    var payload = {
                        name: $scope.form.name,
                        description: $scope.form.description
                    };

                    var promise;
                    if (tag.id) {
                        promise = Tag.data.update({ id: tag.id }, payload).$promise;
                    } else {
                        promise = Tag.data.create({}, payload).$promise;
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