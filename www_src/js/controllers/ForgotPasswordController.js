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

angular.module('GigKeeper').controller('ForgotPasswordController', [
    '$state', '$stateParams', 'Security', 'Alerts',
    function($state, $stateParams, Security, Alerts) {

        var vm = this;

        vm.form = {
            email: typeof $stateParams.email == 'undefined' ? null : $stateParams.email
        };

        vm.submit = function(forgotPasswordForm) {

            if (forgotPasswordForm.$valid) {

                var button = angular.element('#submit_button');
                button.button('loading');

                Security.data.requestPasswordReset({ email: vm.form.email }).$promise.then(function() {
                    Alerts.add('Password reset link sent. Please check your email.', Alerts.constants.success);
                    button.button('reset');

                    $state.go('home');
                }).catch(function(error) {
                    Alerts.add(error.message, 'error');
                    button.button('reset');
                });
            } else {
                Alerts.add('Check form for errors');
            }
        };
    }
]);