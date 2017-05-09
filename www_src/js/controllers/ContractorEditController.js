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
    '$uibModalInstance', 'Contractor', 'contractor', 'BlockingPromiseManager', 'Alerts',
    function($uibModalInstance, Contractor, contractor, BlockingPromiseManager, Alerts) {

        var vm = this;

        vm.form = {
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

        vm.submit = function(contractorForm) {

            if (!contractorForm.$invalid) {

                var button = angular.element('#save_button');
                button.button('loading');

                var payload = {
                    name: vm.form.name,
                    contact: vm.form.contact,
                    address1: vm.form.address1,
                    address2: vm.form.address2,
                    city: vm.form.city,
                    region: vm.form.region,
                    postalCode: vm.form.postalCode,
                    phone: vm.form.phone,
                    email: vm.form.email,
                    web: vm.form.web
                };

                var promise;
                if (contractor.id) {
                    promise = Contractor.data.update({ id: contractor.id }, payload).$promise;
                } else {
                    promise = Contractor.data.create({}, payload).$promise;
                }

                promise.then(function(result) {
                    $uibModalInstance.close(result);
                    button.button('reset');
                }).catch(function(error) {
                    Alerts.add(error.message, Alerts.constants.error);
                    button.button('reset');
                });

                BlockingPromiseManager.add(promise);
            } else {
                Alerts.add('Check form for errors', Alerts.constants.error);
            }
        };

        vm.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);