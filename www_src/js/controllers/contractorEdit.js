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