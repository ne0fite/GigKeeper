(function() {
    'use strict';

    angular.module('GigKeeper').controller('GigEditController', [
        '$scope', '$uibModalInstance', 'Contractor', 'Tag', 'Gig', 'gig', 'UrlBuilder',
        function($scope, $uibModalInstance, Contractor, Tag, Gig, gig, UrlBuilder) {

            $scope.contractorDropdownOptions = Contractor.getDropdownOptions();

            $scope.descriptionsComboOptions = {
                autoBind: false,
                dataSource: new kendo.data.DataSource({
                    transport: {
                        read: {
                            url: UrlBuilder.build('/api/v1/gig/descriptions')
                        }
                    }
                }),
                dataTextField: 'name',
                dataValueField: 'name'
            };

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
                tags: gig.tags,
                notes: gig.notes
            };

            /**
             * Estimate the distance to the specified location
             * 
             * @param  {object} $event The Angular event object
             * 
             * @return {void}
             */
            $scope.estimateDistance = function($event) {
                $event.preventDefault();

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
                        tags: $scope.form.tags,
                        notes: $scope.form.notes
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