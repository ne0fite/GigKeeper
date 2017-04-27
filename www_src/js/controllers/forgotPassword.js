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

angular.module('GigKeeper').controller('forgotPassword', [
    '$scope', '$state', '$stateParams', 'Security',
    function($scope, $state, $stateParams, Security) {

        $scope.form = {
            email: typeof $stateParams.email == 'undefined' ? null : $stateParams.email
        };

        $scope.submit = function(forgotPasswordForm) {

            if (forgotPasswordForm.$valid) {

                $scope.errorMessage = null;
                $scope.successMessage = null;

                var button = angular.element('#submit_button');
                button.button('loading');

                Security.data.requestPasswordReset({ email: $scope.form.email }).$promise.then(function() {
                    $scope.alerts.push({
                        msg: 'Password reset link sent. Please check your email.',
                        type: 'success'
                    });
                    button.button('reset');

                    $state.go('home');
                }).catch(function(error) {
                    $scope.errorMessage = error.message;
                    button.button('reset');
                });
            } else {
                $scope.errorMessage = 'Check form for errors';
            }
        };
    }
]);