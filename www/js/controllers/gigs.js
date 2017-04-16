(function() {
    'use strict';

    angular.module('GigKeeper').controller('gigs', function($scope, $uibModal, uiGridConstants, dialogs, contractors, Gig) {

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
                templateUrl: '/gigEdit.html',
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
    });


    angular.module('GigKeeper').controller('GigEditController', [
        '$scope', '$uibModalInstance', 'Contractor', 'Tag', 'Gig', 'gig',
        function($scope, $uibModalInstance, Contractor, Tag, Gig, gig) {

            $scope.contractorDropdownOptions = Contractor.getDropdownOptions();

            $scope.distanceOptions = {
                decimals: 1,
                min: 0,
                format: 'n1'
            };

            $scope.durationOptions = {
                decimals: 0,
                min: 0,
                format: 'n0'
            };

            $scope.tagDropdownOptions = Tag.getDropdownOptions();

            $scope.form = {
                name: gig.name,
                place: angular.fromJson(gig.place),
                distance: gig.distance,
                duration: gig.duration,
                startDate: new Date(gig.startDate),
                endDate: new Date(gig.endDate),
                contractorId: gig.contractorId,
                tags: gig.tags
            };

            $scope.estimateDistance = function() {
                if ($scope.form.place) {

                    var button = angular.element('#estimate_button');
                    button.button('loading');

                    Gig.data.distanceTo({placeId: $scope.form.place.place_id}).$promise.then(function(response) {
                        if (response) {
                            var element = response.rows[0].elements[0];

                            // convert KM to miles
                            $scope.form.distance = element.distance.value / 1000 / 1.609344;

                            // convert seconds to minutes
                            $scope.form.duration = element.duration.value / 60;
                        } else {
                            console.log(response);
                        }

                        button.button('reset');
                    }).catch(function(error) {
                        console.log(error);
                        button.button('reset');
                    });
                } else {
                    console.log('Please select a location');
                }
            };

            $scope.next = function() {

            };

            $scope.prev = function() {

            };

            $scope.submit = function(gigForm) {

                if (!gigForm.$invalid) {

                    var button = angular.element('#save_button');
                    button.button('loading');

                    var payload = {
                        name: $scope.form.name,
                        place: $scope.form.place,
                        distance: $scope.form.distance,
                        duration: $scope.form.duration,
                        startDate: $scope.form.startDate,
                        endDate: $scope.form.endDate,
                        contractorId: $scope.form.contractorId,
                        tags: $scope.form.tags
                    };

                    var promise;
                    if (gig.id) {
                        promise = Gig.data.update({ id: gig.id }, payload).$promise;
                    } else {
                        promise = Gig.data.create({}, payload).$promise;
                    }

                    promise.then(function() {
                        $uibModalInstance.close();
                        // $scope.successMessage = 'Saved!';
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