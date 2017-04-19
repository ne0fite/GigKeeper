(function() {
    'use strict';

    angular.module('GigKeeper').controller('gigs', [
        '$scope', '$uibModal', 'uiGridConstants', 'dialogs', 'contractors', 'Gig', 'UrlBuilder',
        function($scope, $uibModal, uiGridConstants, dialogs, contractors, Gig, UrlBuilder) {

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
                Gig.data.index().$promise.then(function(gigs) {
                    $scope.gridOptions.data = gigs;
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
                    Gig.data.delete({ id: $scope.selected.entity.id }).$promise.then(function() {
                        load();
                    }).catch(function(error) {
                        console.error(error);
                    });
                }, function() {

                });
            };

            function editDialog(gig) {
                var modalInstance = $uibModal.open({
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: '/template/gigEdit.html',
                    controller: 'GigEditController',
                    resolve: {
                        gig: function() {
                            return gig;
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