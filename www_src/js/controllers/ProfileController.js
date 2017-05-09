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
    'Profile', 'profile', 'Alerts',
    function(Profile, profile, Alerts) {

        var vm = this;

        vm.form = {
            firstName: profile.firstName,
            lastName: profile.lastName,
            email: profile.email,
            phone: profile.phone
        };

        vm.submit = function(profileForm) {

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
                    Alerts.add('Your profile has been saved', 'success');
                }).catch(function(err) {
                    Alerts.add(err.message, 'error');
                }).finally(function() {
                    vm.form.password = null;
                    vm.form.passwordConfirm = null;
                });
            } else {
                Alerts.add('Check form for errors', Alerts);
            }
        };
    }
]);