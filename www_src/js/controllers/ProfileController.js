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

angular.module('GigKeeper').controller('ProfileController', [
    'UrlBuilder', 'BlockingPromiseManager', 'Profile', 'profile',
    function(UrlBuilder, BlockingPromiseManager, Profile, profile) {

        var vm = this;

        vm.form = {
            firstName: profile.firstName,
            lastName: profile.lastName,
            email: profile.email,
            phone: profile.phone
        };

        vm.submit = function(profileForm) {
            vm.errorMessage = null;
            vm.successMessage = null;

            if (!profileForm.$invalid) {

                var payload = {
                    firstName: vm.form.firstName,
                    lastName: vm.form.lastName,
                    email: vm.form.email,
                    phone: vm.form.phone,
                    password: vm.form.password || null,
                    passwordConfirm: vm.form.passwordConfirm || null
                };

                Profile.data.update({}, payload).$promise.then(function() {
                    vm.successMessage = 'Saved!';
                }).catch(function(err) {
                    vm.errorMessage = err.message;
                }).finally(function() {
                    vm.form.password = null;
                    vm.form.passwordConfirm = null;
                });
            } else {
                vm.errorMessage = 'Check form for errors';
            }
        };
    }
]);