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

angular.module('GigKeeper').controller('ResetPasswordController', [
    '$state', '$stateParams', 'Security', 'Alerts', 'Session',
    function($state, $stateParams, Security, Alerts, Session) {

        var vm = this;

        vm.form = {
            token: $stateParams.token,
            password: null,
            passwordConfirm: null
        };

        vm.submit = function(resetPasswordForm) {

            if (resetPasswordForm.$valid) {

                var button = angular.element('#submit_button');
                button.button('loading');

                Security.data.resetPassword(vm.form).$promise.then(function(response) {

                    Alerts.add('Your password has been reset.', Alerts.constants.success);
                    button.button('reset');

                    Session.updateSession(response);

                    $state.go('gigs');
                }).catch(function(error) {
                    Alerts.add(error.message, Alerts.constants.error);
                    button.button('reset');
                });
            } else {
                Alerts.add('Check form for errors', Alerts.constants.error);
            }
        };
    }
]);