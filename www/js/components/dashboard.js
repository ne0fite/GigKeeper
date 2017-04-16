(function() {
    'use strict';

    angular.module('GigKeeper').component('dashboard', {
        templateUrl: 'dashboard.html',
        controller: function($scope, $http, Gig, Contractor) {

            $scope.gigForm = {
                description: null,
                location: null,
                startDate: null,
                endDate: null,
                contractorDropdownOptions: Contractor.getDropdownOptions(),
                contractorId: null
            };

            $scope.gigData = [];

            $scope.getGigs = function(tableState) {
                $scope.gigDataLoading = true;

                Gig.data.index().$promise.then(function(gigs) {
                    $scope.gigData = gigs;
                    $scope.gigDataLoading = false;
                }).catch(function(error) {
                    console.error(error);
                    $scope.gigDataLoading = false;
                });
            };

            $scope.submitQuickEntryForm = function(quickEntryForm) {

                var payload = {
                    name: $scope.gigForm.description,
                    placeId: $scope.gigForm.location.place_id,
                    address: $scope.gigForm.location.formatted_address,
                    startDate: $scope.gigForm.startDate,
                    endDate: $scope.gigForm.endDate,
                    contractorId: $scope.gigForm.contractorId
                };

                $http.post('/api/v1/gig', payload).then(function() {
                    alert('Gig Posted!');
                }).catch(function(error) {
                    console.log(error.statusText);
                    alert(error);
                });
            };
        }
    });
}());