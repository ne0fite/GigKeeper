(function() {
    'use strict';

    angular.module('GigKeeper').controller('ContractorEditController', [
        '$scope', '$uibModalInstance', 'Contractor', 'contractor',
        function($scope, $uibModalInstance, Contractor, contractor) {

            $scope.form = {
                id: contractor.id,
                name: contractor.name,
                contact: contractor.contact,
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
                        contact: $scope.form.contact,
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